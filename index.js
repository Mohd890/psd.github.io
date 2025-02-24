import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import bcrypt from 'https://esm.sh/bcryptjs';

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

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // التحقق من إدخال البيانات
    if (!username || !password) {
        alert('Please fill in both username and password.');
        return;
    }

    // الدخول الافتراضي لـ admin
    if (username === 'admin' && password === 'admin123') {
        const defaultUser = {
            id: 1,
            username: 'admin',
            full_name: 'Admin User',
            job_number: '0000',
            role: 'admin',
            auth_id: 'default'
        };

        localStorage.setItem('user', JSON.stringify(defaultUser));
        window.location.href = 'profile.html'; // توجيه إلى صفحة البروفايل
        return;
    }

    // إذا لم يكن الدخول افتراضيًا، نستخدم Supabase للتحقق
    try {
        // جلب بيانات المستخدم من جدول users
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, username, full_name, job_number, role, auth_id')
            .eq('username', username)
            .single();

        if (userError || !user) {
            alert('Invalid username or password.');
            return;
        }

        // جلب كلمة المرور من auth.users باستخدام auth_id
        const { data: authUser, error: authError } = await supabase
            .from('auth.users')
            .select('id, email, password_hash')
            .eq('id', user.auth_id)
            .single();

        if (authError || !authUser) {
            alert('Invalid username or password.');
            return;
        }

        // التحقق من كلمة المرور باستخدام bcrypt
        const match = await bcrypt.compare(password, authUser.password_hash);
        if (!match) {
            alert('Invalid username or password.');
            return;
        }

        // تخزين بيانات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'profile.html'; // توجيه إلى صفحة البروفايل

    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
    }
});
