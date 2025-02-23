import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://mftwuovfzlooimevxrmz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdHd1b3Zmemxvb2ltZXZ4cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODA1NDQsImV4cCI6MjA1NTY1NjU0NH0.bBeE3_OtfZDkzyCGKfrl77oN9xY7FJjXJ4nEiyptdOg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// تعريف عناصر الصفحة
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// حدث إرسال النموذج
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    const username = usernameInput.value.trim(); // إزالة المسافات الزائدة
    const password = passwordInput.value.trim();

    // التحقق من إدخال البيانات
    if (!username || !password) {
        alert('Please fill in both username and password.');
        return;
    }

    try {
        // محاولة تسجيل الدخول كـ "Admin" افتراضي
        if (username === 'admin' && password === 'admin123') {
            const adminUser = {
                username: 'admin',
                full_name: 'Mohamed Mokhtar',
                job_number: '903881',
                role: 'Admin'
            };
            localStorage.setItem('user', JSON.stringify(adminUser));
            window.location.href = 'profile.html'; // توجيه إلى صفحة البروفايل
            return;
        }

        // محاولة تسجيل الدخول باستخدام Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password) // في الواقع، يجب استخدام bcrypt لمقارنة كلمات المرور
            .single();

        if (user) {
            // تخزين بيانات المستخدم في localStorage
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'profile.html'; // توجيه إلى صفحة البروفايل
        } else {
            alert('Invalid username or password.'); // رسالة خطأ إذا كانت البيانات غير صحيحة
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.'); // رسالة خطأ عامة
    }
});
