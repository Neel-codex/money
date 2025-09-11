import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { activationKey, telegramContact } = body;

    if (!activationKey || !telegramContact) {
      return Response.json(
        { error: "Activation key and Telegram contact are required" },
        { status: 400 }
      );
    }

    // Check if activation key exists and is not used
    const keyRows = await sql`
      SELECT * FROM activation_keys 
      WHERE key_code = ${activationKey} AND is_used = FALSE
    `;

    if (keyRows.length === 0) {
      return Response.json(
        { error: "Invalid or already used activation key" },
        { status: 400 }
      );
    }

    // Mark key as used and create user
    const [updatedKey, newUser] = await sql.transaction([
      sql`
        UPDATE activation_keys 
        SET is_used = TRUE, used_by = ${telegramContact}, used_at = CURRENT_TIMESTAMP
        WHERE key_code = ${activationKey}
        RETURNING *
      `,
      sql`
        INSERT INTO users (telegram_contact, activation_key)
        VALUES (${telegramContact}, ${activationKey})
        RETURNING *
      `
    ]);

    return Response.json({
      success: true,
      message: "Activation successful",
      user: newUser[0]
    });

  } catch (error) {
    console.error("Activation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}