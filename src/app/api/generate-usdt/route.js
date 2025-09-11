import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, amount, recipientAddress } = body;

    if (!userId || !amount || !recipientAddress) {
      return Response.json(
        { error: "User ID, amount, and recipient address are required" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 100000) {
      return Response.json(
        { error: "Amount must be between 0 and 100,000 USDT" },
        { status: 400 }
      );
    }

    // Validate Ethereum address format (basic validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      return Response.json(
        { error: "Invalid recipient address format" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userRows = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    if (userRows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create USDT transaction
    const transactionRows = await sql`
      INSERT INTO usdt_transactions (user_id, amount, recipient_address, status)
      VALUES (${userId}, ${amount}, ${recipientAddress}, 'processing')
      RETURNING *
    `;

    // Simulate processing delay and success
    setTimeout(async () => {
      try {
        await sql`
          UPDATE usdt_transactions 
          SET status = 'completed'
          WHERE id = ${transactionRows[0].id}
        `;
      } catch (error) {
        console.error("Error updating transaction status:", error);
      }
    }, 3000);

    return Response.json({
      success: true,
      message: "USDT generation initiated",
      transaction: transactionRows[0]
    });

  } catch (error) {
    console.error("USDT generation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}