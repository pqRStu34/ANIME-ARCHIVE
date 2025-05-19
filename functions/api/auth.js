import bcrypt from "bcryptjs";

export async function onRequestPost(context) {
    const db = context.env.DB; // D1 binding
    const { email, password, action } = await context.request.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ success: false, message: "Missing email or password." }), { status: 400 });
    }

    if (action === "signup") {
        // Check if user exists
        const { results } = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).all();
        if (results.length > 0) {
            return new Response(JSON.stringify({ success: false, message: "Email already registered." }), { status: 409 });
        }
        // Hash password
        const hashed = await bcrypt.hash(password, 10);
        await db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").bind(email, hashed).run();
        return new Response(JSON.stringify({ success: true, email }), { status: 200 });
    }

    if (action === "signin") {
        const { results } = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).all();
        if (results.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "Invalid email or password." }), { status: 401 });
        }
        const valid = await bcrypt.compare(password, results[0].password);
        if (!valid) {
            return new Response(JSON.stringify({ success: false, message: "Invalid email or password." }), { status: 401 });
        }
        return new Response(JSON.stringify({ success: true, email }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false, message: "Unknown action." }), { status: 400 });
}