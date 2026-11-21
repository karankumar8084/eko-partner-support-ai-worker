
import React from "react";

function WelcomeCard({ partner }) {
  return (
    <section className="welcome">
      <div className="welcome-content">
        <h2>
          Welcome back, {partner?.name || "Partner"} 👋
        </h2>

        <p>
          Here's your business performance and financial
          activity overview.
        </p>
      </div>

      <div className="date-badge">
        Partner Overview
      </div>
    </section>
  );
}

export default WelcomeCard;
  