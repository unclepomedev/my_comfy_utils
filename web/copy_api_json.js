import {app} from "../../scripts/app.js";

function toast(msg, ok = true) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
        "position:fixed;right:16px;bottom:64px;z-index:99999;padding:8px 14px;" +
        "border-radius:6px;color:#fff;font:13px sans-serif;" +
        "background:" + (ok ? "#2e7d32" : "#c62828");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

async function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:0;";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    if (!ok) throw new Error("execCommand copy failed");
}

async function copyApiJson() {
    try {
        const {output} = await app.graphToPrompt();
        await writeClipboard(JSON.stringify(output, null, 2));
        toast("API JSON copied");
    } catch (e) {
        console.error(e);
        toast("Copy failed (see console)", false);
    }
}

app.registerExtension({
    name: "Local.CopyApiJson",
    async setup() {
        const btn = document.createElement("button");
        btn.textContent = "Copy API JSON";
        btn.style.cssText =
            "position:fixed;right:16px;bottom:16px;z-index:99999;padding:8px 12px;" +
            "border:none;border-radius:6px;background:#444;color:#fff;" +
            "font:13px sans-serif;cursor:pointer;opacity:.85;";
        btn.onclick = copyApiJson;
        document.body.appendChild(btn);

        window.addEventListener("keydown", (e) => {
            if (e.code === "KeyC" && e.ctrlKey && e.shiftKey && (e.metaKey || e.altKey)) {
                e.preventDefault();
                copyApiJson();
            }
        });
    },
});
