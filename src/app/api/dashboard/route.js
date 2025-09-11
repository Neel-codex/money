import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user data and recent transactions
    const [userRows, transactionRows] = await sql.transaction([
      sql`
        SELECT u.*, ak.key_code, ak.used_at as activation_date
        FROM users u
        JOIN activation_keys ak ON u.activation_key = ak.key_code
        WHERE u.id = ${userId}
      `,
      sql`
        SELECT * FROM usdt_transactions 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 10
      `
    ]);

    if (userRows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userRows[0];
    const transactions = transactionRows;

    // Calculate stats
    const totalGenerated = transactions.reduce((sum, tx) => {
      return tx.status === 'completed' ? sum + parseFloat(tx.amount) : sum;
    }, 0);

    const pendingTransactions = transactions.filter(tx => tx.status === 'processing').length;
    const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;

    return Response.json({
      user,
      transactions,
      stats: {
        totalGenerated,
        pendingTransactions,
        completedTransactions,
        totalTransactions: transactions.length
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}