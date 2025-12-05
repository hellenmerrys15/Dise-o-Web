document.addEventListener("DOMContentLoaded", () => {

    const formSolicitud = document.getElementById("formSolicitud");
    const msgExito = document.getElementById("msg-exito");

    if (formSolicitud) {
        formSolicitud.addEventListener("submit", (e) => {
            if (!formSolicitud.checkValidity()) {
                e.preventDefault();
                formSolicitud.reportValidity();
                return;
            }

            e.preventDefault();
            msgExito.style.display = "block";
            setTimeout(() => { msgExito.style.opacity = "1"; }, 50);

            formSolicitud.reset();

            setTimeout(() => {
                msgExito.style.opacity = "0";
                setTimeout(() => { msgExito.style.display = "none"; }, 400);
            }, 3000);
        });
    }

    const formInscripcion = document.getElementById("formInscripcion");
    const msgInscripcion = document.getElementById("msgInscripcion");
    const codigo = document.getElementById("codigo");
    const correoGenerado = document.getElementById("correoGenerado");

    if (codigo && correoGenerado) {
        codigo.addEventListener("input", () => {
            if (codigo.value.trim() !== "") {
                correoGenerado.value = codigo.value.trim() + "@continental.edu.pe";
            } else {
                correoGenerado.value = "";
            }
        });
    }

    if (formInscripcion) {
        formInscripcion.addEventListener("submit", (e) => {
            if (!formInscripcion.checkValidity()) {
                e.preventDefault();
                formInscripcion.reportValidity();
                return;
            }

            e.preventDefault();
            msgInscripcion.style.display = "block";
            setTimeout(() => { msgInscripcion.style.opacity = "1"; }, 50);

            formInscripcion.reset();
            if (correoGenerado) correoGenerado.value = "";

            setTimeout(() => {
                msgInscripcion.style.opacity = "0";
                setTimeout(() => { msgInscripcion.style.display = "none"; }, 400);
            }, 3000);
        });
    }

});
