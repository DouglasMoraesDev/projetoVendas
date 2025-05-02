const token = localStorage.getItem("token");

// … seu código de backup continua aqui …

// Auditoria em PDF
document
  .getElementById("btnAuditoriaPdf")
  .addEventListener("click", async () => {
    const monthInput = document.getElementById("mes").value;
    if (!monthInput) {
      alert("Selecione um mês");
      return;
    }
    const [year, month] = monthInput.split("-");

    // <-- nota: /auditoria/pdf em vez de /auditoria
    const res = await fetch(
      `/api/config/auditoria/pdf?year=${year}&month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      alert("Erro ao baixar PDF da auditoria");
      return;
    }
    // pega o binário corretamente
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // filename virá no header Content-Disposition
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
