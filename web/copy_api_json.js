import { app } from "../../scripts/app.js";

const CMD_ID = "Local.CopyApiJson";

async function copyApiJson() {
    const { output } = await app.graphToPrompt();
    const text = JSON.stringify(output, null, 2);
    try {
        await navigator.clipboard.writeText(text);
        app.extensionManager.toast.add({
            severity: "success",
            summary: "API JSON copied",
            life: 1500,
        });
    } catch (e) {
        console.error(e);
        app.extensionManager.toast.add({
            severity: "error",
            summary: "Copy failed (see console)",
            life: 3000,
        });
    }
}

app.registerExtension({
    name: "Local.CopyApiJson",
    commands: [
        {
            id: CMD_ID,
            label: "Copy API JSON",
            icon: "pi pi-copy",
            function: copyApiJson,
        },
    ],
    keybindings: [
        {
            combo: { key: "c", ctrl: true, shift: true, alt: true },
            commandId: CMD_ID,
        },
    ],
    menuCommands: [
        { path: ["Workflow"], commands: [CMD_ID] },
    ],
});
