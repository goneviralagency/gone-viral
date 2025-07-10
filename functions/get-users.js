
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://dptolytfqrdzhvdlntfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdG9seXRmcXJkemh2ZGxudGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzUzMDksImV4cCI6MjA2NzU1MTMwOX0.gi8fekd2RZUomuAebzTU_Vs62pJXQBcSukr2evYcnok'  // anon key still safe here for public access if needed
);

const adminClient = createClient(
  'https://dptolytfqrdzhvdlntfb.supabase.co',
  '208'  // replace at runtime
);

exports.handler = async function(event, context) {
  const authHeader = event.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || user.email !== "admin@goneviral.com") {
    return {
      statusCode: 403,
      body: "Forbidden"
    };
  }

  const { data: users } = await adminClient.auth.admin.listUsers();
  return {
    statusCode: 200,
    body: JSON.stringify(users)
  };
};
