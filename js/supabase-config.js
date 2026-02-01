
const SUPABASE_URL = 'https://eecnbjejbkacvtjolkey.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY25iamVqYmthY3Z0am9sa2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTk3NzEsImV4cCI6MjA4NTI3NTc3MX0.GJ56krmsQ3zFG8WMiRkmZnEhyFG4evZTlsijyX5pnMc';


let supabaseClient = null;

function getSupabaseClient() {
    if (supabaseClient) {
        return supabaseClient;
    }


    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized successfully');
        return supabaseClient;
    }

    console.error('❌ Supabase library not loaded yet');
    return null;
}

(function () {

    const client = getSupabaseClient();
    if (!client) {

        window.addEventListener('load', function () {
            getSupabaseClient();
        });
    }
})();

async function signUpUser(email, password, firstName, surname) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not initialized. Please refresh the page.');
    }

    const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                first_name: firstName,
                surname: surname
            }
        }
    });

    if (error) {
        console.error('Signup error:', error.message);
        throw error;
    }

    return data;
}


async function signInUser(email, password) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not initialized. Please refresh the page.');
    }

    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error('Login error:', error.message);
        throw error;
    }

    return data;
}

async function signOutUser() {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not initialized. Please refresh the page.');
    }

    const { error } = await client.auth.signOut();

    if (error) {
        console.error('Logout error:', error.message);
        throw error;
    }

    window.location.href = '/LoginForm/metromovies-loginform.html';
}


async function getCurrentUser() {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data: { user } } = await client.auth.getUser();
    return user;
}


async function getSession() {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data: { session } } = await client.auth.getSession();
    return session;
}

async function isAuthenticated() {
    const session = await getSession();
    return session !== null;
}

async function resetPassword(email) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not initialized. Please refresh the page.');
    }

    const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/LoginForm/metromovies-loginform.html'
    });

    if (error) {
        console.error('Password reset error:', error.message);
        throw error;
    }

    return data;
}

async function getUserProfile(userId) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Get profile error:', error.message);
        throw error;
    }

    return data;
}

async function updateUserProfile(userId, updates) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not initialized. Please refresh the page.');
    }

    const { data, error } = await client
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Update profile error:', error.message);
        throw error;
    }

    return data;
}

function onAuthStateChange(callback) {
    const client = getSupabaseClient();
    if (!client) return;

    client.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        callback(event, session);
    });
}


async function requireAuth() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        window.location.href = '/LoginForm/metromovies-loginform.html';
        return false;
    }

    return true;
}

window.MetroMoviesAuth = {
    init: getSupabaseClient,
    signUp: signUpUser,
    signIn: signInUser,
    signOut: signOutUser,
    getCurrentUser,
    getSession,
    isAuthenticated,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    onAuthStateChange,
    requireAuth
};

console.log('🎬 Metro Movies Auth module loaded');
