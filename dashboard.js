import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    const supabase = createClient(
      'https://dptolytfqrdzhvdlntfb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdG9seXRmcXJkemh2ZGxudGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzUzMDksImV4cCI6MjA2NzU1MTMwOX0.gi8fekd2RZUomuAebzTU_Vs62pJXQBcSukr2evYcnok'
    );

    let currentUser = null;

    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Not logged in");
      currentUser = user;
      loadIncomingBattles();
      loadScheduledBattles();
    }

    async function loadIncomingBattles() {
      const container = document.getElementById("incoming");
      container.innerHTML = "";
      const { data } = await supabase
        .from("battles")
        .select("*")
        .eq("recipient_id", currentUser.id)
        .eq("recipient_confirm", "pending")
        .eq("status", "Request Sent");

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No incoming battles.</p>";
        return;
      }

      data.forEach(b => {
        const div = document.createElement("div");
        div.className = "battle-card";
        div.innerHTML = `
          <p><strong>@${b.requester_username}</strong></p>
          <p>Date: ${b.date}</p>
          <p>Time: ${b.time}</p>
          <button class="accept" onclick="acceptBattle(${b.id}, '${b.date}', '${b.start_time}')">Accept</button>
          <button class="decline" onclick="declineBattle(${b.id}, '${b.date}', '${b.start_time}')">Decline</button>
        `;
        container.appendChild(div);
      });
    }

    async function loadScheduledBattles() {
      const container = document.getElementById("scheduled");
      container.innerHTML = "";
      const { data } = await supabase
        .from("battles")
        .select("*")
        .eq("recipient_id", currentUser.id)
        .eq("recipient_confirm", "confirmed");

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No scheduled battles.</p>";
        return;
      }

      data.forEach(b => {
        const div = document.createElement("div");
        div.className = "battle-card";
        div.innerHTML = `
          <p><strong>@${b.requester_username}</strong></p>
          <p>Date: ${b.date}</p>
          <p>Time: ${b.time}</p>
          <button class="cancel" onclick="cancelBattle(${b.id}, '${b.date}', '${b.start_time}', '${b.requester_id}')">Cancel Battle</button>
        `;
        container.appendChild(div);
      });
    }

    window.acceptBattle = async function(id, date, start_time) {
      await supabase.from("battles").update({ recipient_confirm: "confirmed" }).eq("id", id);
      alert("Battle confirmed!");
      loadDashboard();
    }

    window.declineBattle = async function(id, date, start_time) {
      await supabase.from("battles").delete().eq("id", id);
      await supabase.from("availability").update({ status: "available" }).eq("date", date).eq("start_time", start_time);
      alert("Battle declined and availability restored.");
      loadDashboard();
    }

    window.cancelBattle = async function(id, date, start_time, opponent_id) {
      await supabase.from("battles").delete().eq("id", id);
      await supabase.from("availability").update({ status: "available" }).eq("date", date).eq("start_time", start_time);
      await supabase.from("notifications").insert({
        user_id: opponent_id,
        message: "Your scheduled battle has been cancelled."
      });
      alert("Battle cancelled.");
      loadDashboard();
    }

    loadDashboard();
    setInterval(loadDashboard, 60000);