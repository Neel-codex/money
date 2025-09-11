import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { count = 1, prefix = 'USDT-FLASH' } = body;

    if (count < 1 || count > 100) {
      return Response.json(
        { error: "Count must be between 1 and 100" },
        { status: 400 }
      );
    }

    const keys = [];
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    for (let i = 0; i < count; i++) {
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      const keyCode = `${prefix}-${currentDate}-${randomString}-${timestamp}`;
      keys.push(keyCode);
    }

    // Insert all keys in a transaction
    const insertQueries = keys.map(keyCode => 
      sql`INSERT INTO activation_keys (key_code) VALUES (${keyCode}) RETURNING *`
    );

    const results = await sql.transaction(insertQueries);
    const insertedKeys = results.map(result => result[0]);

    return Response.json({
      success: true,
      message: `Generated ${count} activation keys`,
      keys: insertedKeys
    });

  } catch (error) {
    console.error("Key generation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || 'all';
    
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    if (status === 'used') {
      whereClause = 'WHERE is_used = TRUE';
    } else if (status === 'unused') {
      whereClause = 'WHERE is_used = FALSE';
    }

    const [keysResult, countResult] = await sql.transaction([
      sql`
        SELECT k.*, u.telegram_contact 
        FROM activation_keys k
        LEFT JOIN users u ON k.key_code = u.activation_key
        ${sql.raw(whereClause)}
        ORDER BY k.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) as total
        FROM activation_keys
        ${sql.raw(whereClause)}
      `
    ]);

    const stats = await sql`
      SELECT 
        COUNT(*) as total_keys,
        COUNT(*) FILTER (WHERE is_used = TRUE) as used_keys,
        COUNT(*) FILTER (WHERE is_used = FALSE) as unused_keys
      FROM activation_keys
    `;

    return Response.json({
      keys: keysResult,
      total: parseInt(countResult[0].total),
      page,
      limit,
      stats: stats[0]
    });

  } catch (error) {
    console.error("Keys fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}