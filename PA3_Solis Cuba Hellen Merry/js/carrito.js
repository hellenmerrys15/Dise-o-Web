const COUPON_CODE = "ANIME10";
const COUPON_DISCOUNT = 0.10;

const cart = [];
let couponApplied = false;
let couponExpired = false;

const formatMoney = v => "S/ " + v.toFixed(2);

class MensajeBase {
    constructor(texto) {
        this.texto = texto;
    }
    mostrar() {
        return this.texto;
    }
}

class MensajeExito extends MensajeBase {
    mostrar() {
        return "Compra realizada correctamente. " + this.texto;
    }
}

class MensajeErrorTiempo extends MensajeBase {
    mostrar() {
        return "El cupón ya no es válido: " + this.texto;
    }
}

MensajeBase.prototype.longitud = function () {
    return this.texto.length;
};

const mensajesMapa = new Map();
mensajesMapa.set("compra", new MensajeExito("Gracias por su compra."));
mensajesMapa.set("tiempo", new MensajeErrorTiempo("el tiempo de uso ha expirado."));

function crearContadorIncremental(paso = 1) {
    let contador = 0;
    return function () {
        contador += paso;
        return contador;
    };
}

const contadorConfirmaciones = crearContadorIncremental(1);

function renderCart() {
    const tbody = document.getElementById("cart-body");
    tbody.innerHTML = "";

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">Tu carrito está vacío.</td></tr>`;
        updateTotals();
        return;
    }

    cart.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td><input type="number" min="1" value="${item.qty}" class="form-control form-control-sm qty-input"></td>
            <td>${formatMoney(item.price)}</td>
            <td>${formatMoney(item.price * item.qty)}</td>
            <td><button class="btn btn-sm btn-danger btn-del">X</button></td>
       `;

        tr.querySelector(".qty-input").addEventListener("change", e => {
            let q = parseInt(e.target.value);
            if (isNaN(q) || q <= 0) q = 1;
            item.qty = q;
            renderCart();
        });

        tr.querySelector(".btn-del").addEventListener("click", () => {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
            renderCart();
        });

        tbody.appendChild(tr);
    });

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    let subtotalFisico = 0;
    cart.forEach(i => {
        if (i.category !== "Digital") {
            subtotalFisico += i.price * i.qty;
        }
    });

    let delivery = 0;
    if (subtotalFisico > 0 && subtotalFisico < 50) delivery = 10;
    else if (subtotalFisico >= 50 && subtotalFisico <= 100) delivery = 15;
    else if (subtotalFisico > 100) delivery = 30;

    const discount = couponApplied && !couponExpired ? subtotal * COUPON_DISCOUNT : 0;
    const total = subtotal - discount + delivery;

    document.getElementById("subtotal-cell").textContent = formatMoney(subtotal);
    document.getElementById("descuento-cell").textContent = "- " + formatMoney(discount);
    document.getElementById("delivery-cell").textContent = formatMoney(delivery);
    document.getElementById("total-cell").textContent = formatMoney(total);
}

document.getElementById("zona-catalogo").addEventListener("click", e => {
    if (!e.target.classList.contains("btn-add")) return;

    const btn = e.target;
    const id = btn.dataset.id;

    let item = cart.find(p => p.id === id);
    if (item) {
        item.qty += 1;
    } else {
        item = {
            id: id,
            name: btn.dataset.name,
            category: btn.dataset.category,
            price: parseFloat(btn.dataset.price),
            qty: 1
        };
        cart.push(item);
    }

    renderCart();
});

document.getElementById("btn-cupon").addEventListener("click", () => {
    const code = document.getElementById("cupon").value.trim().toUpperCase();

    if (couponExpired) {
        const m = mensajesMapa.get("tiempo");
        alert(m ? m.mostrar() : "El cupón ya no es válido.");
        return;
    }

    if (code !== COUPON_CODE) {
        couponApplied = false;
        alert("Código de cupón incorrecto.");
        updateTotals();
        return;
    }

    if (!couponApplied) {
        couponApplied = true;
        alert("Cupón aplicado correctamente.");
    } else {
        alert("El cupón ya se encuentra aplicado a tu compra.");
    }

    updateTotals();
});

document.getElementById("btn-confirmar").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const intentos = contadorConfirmaciones();
    const m = mensajesMapa.get("compra");
    const texto = m ? m.mostrar() : "Gracias por su compra.";
    alert(texto + "\nIntentos de confirmación: " + intentos);

    cart.length = 0;
    couponApplied = false;
    document.getElementById("cupon").value = "";
    renderCart();
});

function ofertaRegresiva(seconds) {
    const msg = document.getElementById("mensaje-oferta");
    if (!msg) return;

    if (seconds <= 0) {
        msg.textContent = "El cupón ANIME10 ha expirado.";
        couponExpired = true;
        return;
    }

    const min = Math.floor(seconds / 60);
    const sec = String(seconds % 60).padStart(2, "0");
    msg.textContent = `Cupón ANIME10 disponible por ${min}:${sec}`;

    setTimeout(() => ofertaRegresiva(seconds - 1), 1000);
}

document.addEventListener("click", e => {
    const t = e.target;
}, true);

document.addEventListener("DOMContentLoaded", () => {
    const cuponInput = document.getElementById("cupon");
    if (cuponInput) {
        cuponInput.addEventListener("focus", () => {
            cuponInput.style.outline = "2px solid #f47521";
        });
        cuponInput.addEventListener("blur", () => {
            cuponInput.style.outline = "none";
        });
        cuponInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("btn-cupon").click();
            }
        });
    }

    const zonaCarrito = document.getElementById("zona-carrito");
    if (zonaCarrito) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                zonaCarrito.style.boxShadow = "0 0 10px rgba(0,0,0,.35)";
            } else {
                zonaCarrito.style.boxShadow = "none";
            }
        });
    }
});

ofertaRegresiva(300);
renderCart();
