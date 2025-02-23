document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem('user')); // جلب بيانات المستخدم من localStorage
  const location = "Current Location";

  // Supabase Config
  const SUPABASE_URL = "https://mftwuovfzlooimevxrmz.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdHd1b3Zmemxvb2ltZXZ4cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODA1NDQsImV4cCI6MjA1NTY1NjU0NH0.bBeE3_OtfZDkzyCGKfrl77oN9xY7FJjXJ4nEiyptdOg";

  // Initialize Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // عرض قسم الأدمن فقط إذا كان المستخدم أدمن
  if (user && user.role === 'Admin') {
    document.getElementById('adminSection').style.display = 'block';
  }

  // تحديث التاريخ والوقت تلقائيًا
  function updateDateTime() {
    const now = new Date();
    const formattedDateTime =
      now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US");
    if (document.getElementById("datetime")) {
      document.getElementById("datetime").value = formattedDateTime;
    }
  }

  // تسجيل الخروج
  function logout() {
    localStorage.removeItem('user'); // حذف بيانات المستخدم
    window.location.href = 'index.html'; // توجيه إلى صفحة تسجيل الدخول
  }

  // جلب الإحصائيات
  async function fetchStatistics() {
    try {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("username", user.username)
        .single();

      if (error) {
        throw new Error("Failed to fetch statistics");
      }

      // تحديث الإحصائيات في الواجهة
      if (document.getElementById("totalReports")) {
        document.getElementById("totalReports").textContent =
          data.total_reports || 0;
      }
      if (document.getElementById("completedReports")) {
        document.getElementById("completedReports").textContent =
          data.completed_reports || 0;
      }
      if (document.getElementById("inProgressReports")) {
        document.getElementById("inProgressReports").textContent =
          data.in_progress_reports || 0;
      }
      if (document.getElementById("closedReports")) {
        document.getElementById("closedReports").textContent =
          data.closed_reports || 0;
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }

  // إنشاء الرسوم البيانية
  function createCharts() {
    const employeeChart = new Chart(document.getElementById('employeeChart'), {
      type: 'doughnut',
      data: {
        labels: ['Employee A', 'Employee B', 'Employee C'],
        datasets: [{
          data: [30, 40, 30],
          backgroundColor: ['#007bff', '#28a745', '#dc3545'],
        }],
      },
    });

    const taskChart = new Chart(document.getElementById('taskChart'), {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Incomplete'],
        datasets: [{
          data: [70, 30],
          backgroundColor: ['#28a745', '#dc3545'],
        }],
      },
    });

    const sectorChart = new Chart(document.getElementById('sectorChart'), {
      type: 'doughnut',
      data: {
        labels: ['Sector A', 'Sector B', 'Sector C'],
        datasets: [{
          data: [40, 35, 25],
          backgroundColor: ['#007bff', '#28a745', '#dc3545'],
        }],
      },
    });

    const assetChart = new Chart(document.getElementById('assetChart'), {
      type: 'doughnut',
      data: {
        labels: ['Asset A', 'Asset B', 'Asset C'],
        datasets: [{
          data: [50, 30, 20],
          backgroundColor: ['#007bff', '#28a745', '#dc3545'],
        }],
      },
    });
  }

  // تهيئة الوظائف
  updateDateTime();
  fetchStatistics();
  createCharts();
});
