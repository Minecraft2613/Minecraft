function getSimulatedKV() {
    try {
        const data = localStorage.getItem('cloudflare_kv_sim');
        return JSON.parse(data) || {};
    } catch (e) {
        console.error("Error parsing simulated KV data from localStorage:", e);
        localStorage.removeItem('cloudflare_kv_sim');
        return {};
    }
}

function putSimulatedKV(key, value) {
    const kv = getSimulatedKV();
    kv[key] = value;
    localStorage.setItem('cloudflare_kv_sim', JSON.stringify(kv));
    console.log(`Simulated KV: Put key "${key}".`);
}

function getSimulatedKVItem(key) {
    const kv = getSimulatedKV();
    const item = kv[key];
    console.log(`Simulated KV: Get key "${key}" -`, item ? 'found' : 'not found');
    return item;
}
