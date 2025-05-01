const token = localStorage.getItem("token"); // assumir JWT guardado

// Backup
document.getElementById("btnBackup").addEventListener("click", () => {
  fetch("/api/config/backup", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro no backup");
      return res.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ""; // filename já vem no header Content-Disposition
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => alert(err.message));
});

// Auditoria
document.getElementById("btnAuditoria").addEventListener("click", async () => {
  const monthInput = document.getElementById("mes").value; // "YYYY-MM"
  if (!monthInput) {
    alert("Selecione um mês");
    return;
  }
  const [year, month] = monthInput.split("-");
  const res = await fetch(`/api/config/auditoria?year=${year}&month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    alert("Erro na auditoria");
    return;
  }
  const data = await res.json();
  document.getElementById("resultado").textContent = JSON.stringify(data, null, 2);
});
