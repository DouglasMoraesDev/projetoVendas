const token = localStorage.getItem("token");

// Backup (continua igual)
document.getElementById("btnBackup").addEventListener("click", () => {
  fetch("/api/config/backup", {
    headers: { Authorization: `Bearer ${token}` },
  })
  /* ... */
});

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
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // nome do arquivo vem no header Content-Disposition
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
