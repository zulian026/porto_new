require("dotenv").config();
console.log("✅ ENV Loaded:", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: "zulian@gmail.com",
      password: "zulian20092004",
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.error("❌ Error creating admin user:", error.message);
      return;
    }

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", data.user.email);
    console.log("🆔 User ID:", data.user.id);
    console.log("🔑 Now you can login to /admin with these credentials");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

createAdminUser();
