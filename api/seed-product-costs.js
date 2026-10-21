const PROJECT_ID = 'asas-software-solutions';

// Private base sale prices stay on the server and are written to the admin-only collection.
const BASE_SALE_PRICES = {
    'scanner-datalogic-3300': 3500,
    'scanner-zebra-ds9208': 2500,
    'scanner-datalogic-2430': 2200,
    'scanner-datalogic-1000i': 1800,
    'scanner-datalogic-qw2100': 1800,
    'scanner-syble-xb-d40': 2500,
    'new-rongta-rpp350-usb': 2000,
    'new-rongta-rpp350-usb-lan': 2100,
    'new-xprinter-80t': 2100,
    'new-rongta-rp211': 2250,
    'new-rongta-rp310': 2900,
    'new-xprinter-233': 2750,
    'new-xprinter-370b': 3600,
    'new-rongta-rpp30': 3100,
    'new-xp-p323b': 3500,
    'imported-star-tsp700ii': 2200,
    'imported-epson-tm88vi-usb': 2800,
    'imported-epson-tm88vi-usb-lan': 4500,
    'imported-fujitsu-fp510': 2200,
    'imported-ncr-7197': 2000,
    'imported-zebra-lp2844': 5000,
    'imported-zebra-zp505': 5000,
    'imported-zebra-zd500': 8000,
    'imported-zebra-gk420t': 8000,
    'imported-zebra-gx420t': 8000,
    'imported-tsc-ttp245c': 8000,
    'imported-tsc-tdp225': 4000,
    'imported-zebra-zxp-series-3': 30000
};

module.exports = async function seedProductCosts(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'الطريقة غير مدعومة.' });
    }

    const authorization = req.headers.authorization || '';
    if (!/^Bearer\s+\S+$/i.test(authorization)) {
        return res.status(401).json({ error: 'سجّل الدخول بحساب مدير المنتجات.' });
    }

    const baseUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/store_product_costs`;
    const writes = Object.entries(BASE_SALE_PRICES).map(async ([productId, basePrice]) => {
        const response = await fetch(`${baseUrl}/${encodeURIComponent(productId)}?updateMask.fieldPaths=basePrice&updateMask.fieldPaths=wholesalePrice`, {
            method: 'PATCH',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    basePrice: { integerValue: String(basePrice) }
                }
            })
        });
        return response.status;
    });

    let results;
    try {
        results = await Promise.all(writes);
    } catch (_) {
        return res.status(502).json({ error: 'تعذر الاتصال بقاعدة البيانات.' });
    }

    if (results.some((status) => status < 200 || status >= 300)) {
        const denied = results.some((status) => status === 401 || status === 403);
        return res.status(denied ? 403 : 502).json({
            error: denied
                ? 'حسابك غير مخوّل لحفظ الأسعار الأساسية. راجع صلاحيات Firebase.'
                : 'لم تكتمل تهيئة الأسعار الأساسية. حاول مرة أخرى.'
        });
    }

    return res.status(200).json({ updated: results.length });
};
