const supabaseUrl = "https://cnzxaysvobnypzpdafyg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuenhheXN2b2JueXB6cGRhZnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg5ODQsImV4cCI6MjA3MzE5NDk4NH0.SMZ4IQUX1iFHIvwPcgWVzYHNhvN8zr2gXofuy4YYlcE";

// Supabase REST API helper
async function supabaseRequest(method, endpoint, data = null) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  return response.json();
}

// SQL template function that converts to Supabase calls
function sql(strings, ...values) {
  const query = strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");

  return {
    query,
    values,
    async then(resolve, reject) {
      try {
        const trimmedQuery = query.trim().toUpperCase();

        if (trimmedQuery.startsWith("SELECT")) {
          const result = await executeSelect(query, values);
          resolve(result);
        } else if (trimmedQuery.startsWith("INSERT")) {
          const result = await executeInsert(query, values);
          resolve(result);
        } else if (trimmedQuery.startsWith("UPDATE")) {
          const result = await executeUpdate(query, values);
          resolve(result);
        } else if (trimmedQuery.startsWith("DELETE")) {
          const result = await executeDelete(query, values);
          resolve(result);
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    },
  };
}

// Helper function to execute SELECT queries
async function executeSelect(query, values) {
  // Handle activation_keys table queries
  if (query.includes("FROM activation_keys")) {
    let endpoint = "activation_keys?select=*";

    if (query.includes("WHERE key_code =")) {
      const keyCode = values[0];
      endpoint += `&key_code=eq.${keyCode}`;
    }

    if (query.includes("WHERE is_used =")) {
      const isUsed = query.includes("TRUE");
      endpoint += `&is_used=eq.${isUsed}`;
    }

    if (query.includes("ORDER BY")) {
      endpoint += "&order=created_at.desc";
    }

    if (query.includes("LIMIT")) {
      const limitMatch = query.match(/LIMIT (\d+)/);
      if (limitMatch) {
        endpoint += `&limit=${limitMatch[1]}`;
      }
    }

    if (query.includes("OFFSET")) {
      const offsetMatch = query.match(/OFFSET (\d+)/);
      if (offsetMatch) {
        endpoint += `&offset=${offsetMatch[1]}`;
      }
    }

    return await supabaseRequest("GET", endpoint);
  }

  // Handle users table queries with joins
  if (
    query.includes("FROM users u") &&
    query.includes("JOIN activation_keys ak")
  ) {
    let endpoint =
      "users?select=*,activation_keys!users_activation_key_fkey(key_code,used_at)";

    if (query.includes("WHERE u.id =")) {
      const userId = values.find(
        (v) => typeof v === "number" || !isNaN(parseInt(v)),
      );
      endpoint += `&id=eq.${parseInt(userId)}`;
    }

    const result = await supabaseRequest("GET", endpoint);

    // Transform the result to match the expected JOIN format
    return result.map((user) => ({
      ...user,
      key_code: user.activation_keys?.key_code,
      activation_date: user.activation_keys?.used_at,
    }));
  }

  // Handle users table simple queries
  if (query.includes("FROM users")) {
    let endpoint = "users?select=*";

    if (query.includes("WHERE id =")) {
      const userId = values.find(
        (v) => typeof v === "number" || !isNaN(parseInt(v)),
      );
      endpoint += `&id=eq.${parseInt(userId)}`;
    }

    return await supabaseRequest("GET", endpoint);
  }

  // Handle usdt_transactions table queries
  if (query.includes("FROM usdt_transactions")) {
    let endpoint = "usdt_transactions?select=*";

    if (query.includes("WHERE user_id =")) {
      const userId = values.find(
        (v) => typeof v === "number" || !isNaN(parseInt(v)),
      );
      endpoint += `&user_id=eq.${parseInt(userId)}`;
    }

    if (query.includes("ORDER BY")) {
      endpoint += "&order=created_at.desc";
    }

    if (query.includes("LIMIT")) {
      const limitMatch = query.match(/LIMIT (\d+)/);
      if (limitMatch) {
        endpoint += `&limit=${limitMatch[1]}`;
      }
    }

    return await supabaseRequest("GET", endpoint);
  }

  // Handle COUNT queries
  if (query.includes("COUNT(*)")) {
    if (query.includes("FROM activation_keys")) {
      let endpoint = "activation_keys?select=count";

      if (query.includes("WHERE is_used =")) {
        const isUsed = query.includes("TRUE");
        endpoint += `&is_used=eq.${isUsed}`;
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      });

      const count = response.headers.get("Content-Range")?.split("/")[1] || "0";
      return [{ total: parseInt(count) }];
    }
  }

  // Handle stats queries with FILTER
  if (query.includes("COUNT(*) FILTER")) {
    const totalResponse = await fetch(
      `${supabaseUrl}/rest/v1/activation_keys?select=count`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const usedResponse = await fetch(
      `${supabaseUrl}/rest/v1/activation_keys?select=count&is_used=eq.true`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const unusedResponse = await fetch(
      `${supabaseUrl}/rest/v1/activation_keys?select=count&is_used=eq.false`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const totalCount =
      totalResponse.headers.get("Content-Range")?.split("/")[1] || "0";
    const usedCount =
      usedResponse.headers.get("Content-Range")?.split("/")[1] || "0";
    const unusedCount =
      unusedResponse.headers.get("Content-Range")?.split("/")[1] || "0";

    return [
      {
        total_keys: parseInt(totalCount),
        used_keys: parseInt(usedCount),
        unused_keys: parseInt(unusedCount),
      },
    ];
  }

  // Handle complex LEFT JOIN queries for admin panel
  if (query.includes("LEFT JOIN users u ON")) {
    let endpoint =
      "activation_keys?select=*,users!users_activation_key_fkey(telegram_contact)";

    if (query.includes("WHERE is_used = TRUE")) {
      endpoint += "&is_used=eq.true";
    } else if (query.includes("WHERE is_used = FALSE")) {
      endpoint += "&is_used=eq.false";
    }

    endpoint += "&order=created_at.desc";

    if (query.includes("LIMIT")) {
      const limitMatch = query.match(/LIMIT (\d+)/);
      if (limitMatch) {
        endpoint += `&limit=${limitMatch[1]}`;
      }
    }

    if (query.includes("OFFSET")) {
      const offsetMatch = query.match(/OFFSET (\d+)/);
      if (offsetMatch) {
        endpoint += `&offset=${offsetMatch[1]}`;
      }
    }

    const result = await supabaseRequest("GET", endpoint);

    // Transform to match expected format
    return result.map((key) => ({
      ...key,
      telegram_contact: key.users?.telegram_contact || null,
    }));
  }

  return [];
}

// Helper function to execute INSERT queries
async function executeInsert(query, values) {
  if (query.includes("INTO activation_keys")) {
    const data = { key_code: values[0] };
    return await supabaseRequest("POST", "activation_keys", data);
  }

  if (query.includes("INTO users")) {
    const data = {
      telegram_contact: values[0],
      activation_key: values[1],
    };
    return await supabaseRequest("POST", "users", data);
  }

  if (query.includes("INTO usdt_transactions")) {
    const data = {
      user_id: values[0],
      amount: values[1],
      recipient_address: values[2],
      status: values[3] || "pending",
    };
    return await supabaseRequest("POST", "usdt_transactions", data);
  }

  return [];
}

// Helper function to execute UPDATE queries
async function executeUpdate(query, values) {
  if (query.includes("activation_keys") && query.includes("SET is_used")) {
    const data = {
      is_used: true,
      used_by: values[0],
      used_at: new Date().toISOString(),
    };
    const endpoint = `activation_keys?key_code=eq.${values[1]}`;
    return await supabaseRequest("PATCH", endpoint, data);
  }

  if (query.includes("usdt_transactions") && query.includes("SET status")) {
    const data = { status: values[0] };
    const endpoint = `usdt_transactions?id=eq.${values[1]}`;
    return await supabaseRequest("PATCH", endpoint, data);
  }

  return [];
}

// Helper function to execute DELETE queries
async function executeDelete(query, values) {
  if (query.includes("FROM activation_keys")) {
    const endpoint = `activation_keys?id=eq.${values[0]}`;
    return await supabaseRequest("DELETE", endpoint);
  }

  return [];
}

// Transaction support
sql.transaction = async function (queries) {
  const results = [];

  for (const query of queries) {
    const result = await query;
    results.push(result);
  }

  return results;
};

// Raw SQL support
sql.raw = function (rawQuery) {
  return { __raw: true, query: rawQuery };
};

export default sql;
