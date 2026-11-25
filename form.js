(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("status");
  const send = document.getElementById("send");
  const sentMsg = form.getAttribute("data-sent") || "Message sent";
  const failMsg = form.getAttribute("data-failed") || "Not sent, try again";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.removeAttribute("data-ok");
    const cfg = window.CONTACT_FORM || {};
    const key = String(cfg.accessKey || "").trim();
    const unready = !key || /^(REPLACE_ME|TODO|PLACEHOLDER|YOUR-)/i.test(key);
    const payload = {
      access_key: key,
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      from_name: "EU VAT Invoices for Shopify privacy site"
    };
    const reply = document.getElementById("reply").value.trim();
    if (reply) payload.email = reply;
    if (document.getElementById("website").value) {
      status.textContent = failMsg; status.dataset.ok = "0"; return;
    }
    if (unready || !payload.subject || !payload.message) {
      status.textContent = failMsg; status.dataset.ok = "0"; return;
    }
    send.disabled = true;
    let ok = false;
    try {
      const res = await fetch(cfg.endpoint || "https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      ok = !!(res.ok && (data.success === true || data.success === "true"));
    } catch (err) { ok = false; }
    status.textContent = ok ? sentMsg : failMsg;
    status.dataset.ok = ok ? "1" : "0";
    if (ok) { document.getElementById("subject").value = ""; document.getElementById("message").value = ""; document.getElementById("reply").value = ""; }
    send.disabled = false;
  });
})();
