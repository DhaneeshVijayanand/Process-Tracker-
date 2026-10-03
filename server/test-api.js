const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting End-to-End API Test Suite...');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('/health');
    assert(health.status === 200 && health.data?.status === 'online', 'Server health check is online');

    // 2. Auth - Admin, Team, Client Login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId: 'admin', password: 'admin123' }),
    });
    assert(adminLogin.status === 200 && adminLogin.data?.token, 'Admin login succeeded');
    const adminToken = adminLogin.data?.token;

    const teamLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId: 'team', password: 'team123' }),
    });
    assert(teamLogin.status === 200 && teamLogin.data?.token, 'Team login succeeded');
    const teamToken = teamLogin.data?.token;

    const clientLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId: 'client', password: 'client123' }),
    });
    assert(clientLogin.status === 200 && clientLogin.data?.token, 'Client login succeeded');
    const clientToken = clientLogin.data?.token;

    // Bad password
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId: 'admin', password: 'wrongpassword' }),
    });
    assert(badLogin.status === 401, 'Bad credentials correctly rejected with 401');

    // 3. Auth Profile
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(meRes.status === 200 && meRes.data?.user?.role === 'CLIENT', 'Profile returned for client');

    // 4. Role Isolation: Projects
    const clientProjects = await request('/projects', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(clientProjects.status === 200 && Array.isArray(clientProjects.data?.projects), 'Client retrieved assigned projects');
    const sampleProjectId = clientProjects.data?.projects[0]?.id;
    assert(sampleProjectId !== undefined, `Found sample project ID: ${sampleProjectId}`);

    // Client trying to access admin route must be 403 Forbidden
    const forbiddenUsers = await request('/users', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(forbiddenUsers.status === 403, 'Client restricted from /users with 403 Forbidden');

    // 5. Updates Feed
    const updatesRes = await request(`/projects/${sampleProjectId}/updates`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(updatesRes.status === 200 && updatesRes.data?.updates?.length >= 2, 'Client fetched chronological updates');
    const sampleUpdateId = updatesRes.data?.updates[0]?.id;

    // 6. Client cannot post update (Only Team and Admin)
    const clientPostUpdate = await request(`/projects/${sampleProjectId}/updates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ text: 'Client illegal update attempt' }),
    });
    assert(clientPostUpdate.status === 403, 'Client blocked from publishing updates (403)');

    // 7. Team posts new daily update
    const teamPostUpdate = await request(`/projects/${sampleProjectId}/updates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${teamToken}` },
      body: JSON.stringify({
        text: 'Automated test daily sprint update: All services passing integrity checks.',
        stage: 'In Progress',
        progress: 75,
      }),
    });
    assert(teamPostUpdate.status === 201, 'Team published daily update successfully');
    const newUpdateId = teamPostUpdate.data?.update?.id;

    // 8. Reactions & Comments
    const reactRes = await request(`/updates/${newUpdateId}/react`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ emoji: '🔥' }),
    });
    assert(reactRes.status === 200 && reactRes.data?.reactionCounts?.['🔥'] >= 1, 'Client reacted with 🔥');

    const commentRes = await request(`/updates/${newUpdateId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ text: 'Looks outstanding from client perspective!' }),
    });
    assert(commentRes.status === 201, 'Client commented on update');

    // 9. Notifications Verification
    const teamNotifs = await request('/notifications', {
      headers: { Authorization: `Bearer ${teamToken}` },
    });
    assert(
      teamNotifs.status === 200 && teamNotifs.data?.notifications?.some(n => n.message.includes('commented')),
      'Team member received notification for client comment'
    );

    const clientNotifs = await request('/notifications', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(
      clientNotifs.status === 200 && clientNotifs.data?.notifications?.some(n => n.message.includes('published a new daily update')),
      'Client received notification for team update'
    );

    // Mark notifications read
    const markRead = await request('/notifications/read', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({}),
    });
    assert(markRead.status === 200, 'Notifications marked read');

    // 10. Admin Provisioning & Stats
    const adminStats = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminStats.status === 200 && adminStats.data?.chartData?.length > 0, 'Admin stats & bar chart data returned');

    // Admin creates a test user
    const testUserId = `testuser_${Date.now()}`;
    const createUserRes = await request('/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        userId: testUserId,
        name: 'Automated Test User',
        password: 'password123',
        role: 'CLIENT',
      }),
    });
    assert(createUserRes.status === 201, 'Admin provisioned new user');
    const createdId = createUserRes.data?.user?.id;

    // Admin deletes test user
    const deleteUserRes = await request(`/users/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteUserRes.status === 200, 'Admin deleted test user');

    // Password change test
    const changePass = await request('/auth/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({
        currentPassword: 'client123',
        newPassword: 'newclientpassword123',
      }),
    });
    assert(changePass.status === 200, 'Password changed successfully');

    // Revert password back to client123 so seed state remains pristine
    const revertPass = await request('/auth/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({
        currentPassword: 'newclientpassword123',
        newPassword: 'client123',
      }),
    });
    assert(revertPass.status === 200, 'Password reverted back to client123');

    console.log(`\n========================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test execution error:', error);
    process.exit(1);
  }
}

runTests();
