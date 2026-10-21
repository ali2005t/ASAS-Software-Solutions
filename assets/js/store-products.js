export const STORE_PHONE = '201032630429';

export const STORE_CATEGORIES = [
    { id: 'barcode_scanners', name: 'اسكانرات باركود', shortName: 'اسكانرات الباركود' },
    { id: 'new_receipt_printers', name: 'طابعات فواتير جديد', shortName: 'طابعات فواتير جديدة' },
    { id: 'imported_printers', name: 'طابعات مستوردة ضمان سنة', shortName: 'طابعات مستوردة' }
];

// Customer prices start unset. The admin enters them separately from the private base sale prices.
// Base sale prices live in store_product_costs and are never published here.
export const INITIAL_STORE_PRODUCTS = [
    { id: 'scanner-datalogic-3300', name: 'DataLogic 3300', category: 'barcode_scanners', description: 'قراءة 2D، ويدعم الاتصال عبر USB.', price: 0, image: 'products-images/datalogic-3300.jpg' },
    { id: 'scanner-zebra-ds9208', name: 'Zebra Symbol DS9208', category: 'barcode_scanners', description: '20 شعاعًا، قراءة 2D، ويدعم الاتصال عبر USB.', price: 0, image: 'products-images/zebra-ds9208.jpg' },
    { id: 'scanner-datalogic-2430', name: 'DataLogic 2430 بالقاعدة', category: 'barcode_scanners', description: 'شعاعان، قراءة 2D، ويدعم الاتصال عبر USB. يشمل القاعدة.', price: 0, image: 'products-images/datalogic-2430.jpg' },
    { id: 'scanner-datalogic-1000i', name: 'DataLogic 1000i', category: 'barcode_scanners', description: '20 شعاعًا، قراءة 2D، ويدعم الاتصال عبر USB.', price: 0, image: 'products-images/datalogic-1000i.jpg' },
    { id: 'scanner-datalogic-qw2100', name: 'Datalogic QW2100', category: 'barcode_scanners', description: 'قراءة باركود 1D، ويدعم الاتصال عبر USB.', price: 0, image: 'products-images/datalogic-qw2100.jpg' },
    { id: 'scanner-syble-xb-d40', name: 'Syble XB-D40 2D لاسلكي', category: 'barcode_scanners', description: 'قراءة 1D و2D، مدى لاسلكي حتى 100 متر، بطارية 1200mAh، وذاكرة داخلية للجرد دون اتصال.', price: 0, image: 'products-images/syble-xb-d40.jpg' },

    { id: 'new-rongta-rpp350-usb', name: 'Rongta RPP350 (USB)', category: 'new_receipt_printers', description: 'سرعة 200 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وإمكانية التوصيل بدرج كاشير.', price: 0, image: 'products-images/rongta-rpp350.jpg' },
    { id: 'new-rongta-rpp350-usb-lan', name: 'Rongta RPP350 (USB/LAN)', category: 'new_receipt_printers', description: 'سرعة 200 مم/ث، USB وLAN، ورق 8 سم، قاطع أوتوماتيك، وإمكانية التوصيل بدرج كاشير.', price: 0, image: 'products-images/rongta-rpp350.jpg' },
    { id: 'new-xprinter-80t', name: 'Xprinter 80T (USB)', category: 'new_receipt_printers', description: 'سرعة 200 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وإمكانية التوصيل بدرج كاشير.', price: 0, image: 'products-images/xprinter-80t.jpg' },
    { id: 'new-rongta-rp211', name: 'Rongta RP211 (USB)', category: 'new_receipt_printers', description: 'سرعة 100 مم/ث، USB، ورق بعرض 4.8 سم.', price: 0, image: 'products-images/rongta-rp211.jpg' },
    { id: 'new-rongta-rp310', name: 'Rongta RP-310 (USB)', category: 'new_receipt_printers', description: 'سرعة 180 مم/ث، USB، ورق بعرض 8 سم.', price: 0, image: 'products-images/rongta-rp310.jpg' },
    { id: 'new-xprinter-233', name: 'Xprinter 233', category: 'new_receipt_printers', description: 'سرعة 101 مم/ث، USB، ورق بعرض 5.8 سم، قاطع أوتوماتيك، وإمكانية التوصيل بدرج كاشير.', price: 0, image: 'products-images/xprinter-233.jpg' },
    { id: 'new-xprinter-370b', name: 'Xprinter 370b', category: 'new_receipt_printers', description: 'طابعة 2×1 للفواتير والباركود، سرعة 152 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وإمكانية التوصيل بدرج كاشير.', price: 0, image: 'products-images/xprinter-370b.jpg' },
    { id: 'new-rongta-rpp30', name: 'Rongta RPP30 (USB/Bluetooth)', category: 'new_receipt_printers', description: 'طابعة محمولة للفواتير والباركود، USB وBluetooth، سرعة 80 مم/ث، ورق 8 سم.', price: 0, image: 'products-images/rongta-rpp30.jpg' },
    { id: 'new-xp-p323b', name: 'XP-P323B (USB/Bluetooth)', category: 'new_receipt_printers', description: 'طابعة محمولة للفواتير والباركود، USB وBluetooth، سرعة 70 مم/ث، ورق 8 سم.', price: 0, image: 'products-images/xp-p323b.jpg' },

    { id: 'imported-star-tsp700ii', name: 'Star TSP700II (USB)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. سرعة 300 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وتوصيل بدرج كاشير.', price: 0, image: 'products-images/star-tsp700ii.jpg' },
    { id: 'imported-epson-tm88vi-usb', name: 'EPSON TM88VI (USB)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. سرعة 300 مم/ث، USB وSerial، ورق 8 سم، قاطع أوتوماتيك، وتوصيل بدرج كاشير.', price: 0, image: 'products-images/epson-tm88vi.jpg' },
    { id: 'imported-epson-tm88vi-usb-lan', name: 'EPSON TM88VI (USB/LAN)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. سرعة 300 مم/ث، USB وLAN، ورق 8 سم، قاطع أوتوماتيك، وتوصيل بدرج كاشير.', price: 0, image: 'products-images/epson-tm88vi.jpg' },
    { id: 'imported-fujitsu-fp510', name: 'Fujitsu FP-510 (USB)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. سرعة 300 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وتوصيل بدرج كاشير.', price: 0, image: 'products-images/fujitsu-fp510.jpg' },
    { id: 'imported-ncr-7197', name: 'NCR 7197 (USB)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. سرعة 300 مم/ث، USB، ورق 8 سم، قاطع أوتوماتيك، وتوصيل بدرج كاشير.', price: 0, image: 'products-images/ncr-7197.jpg' },
    { id: 'imported-zebra-lp2844', name: 'Zebra LP-2844', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.4 سم، سرعة 102 مم/ث، دقة 203 DPI، طباعة حرارية مباشرة فقط.', price: 0, image: 'products-images/zebra-lp2844.jpg' },
    { id: 'imported-zebra-zp505', name: 'Zebra ZP505', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.4 سم، سرعة 127 مم/ث، دقة 203 DPI، طباعة حرارية مباشرة فقط.', price: 0, image: 'products-images/zebra-zp505.jpg' },
    { id: 'imported-zebra-zd500', name: 'Zebra ZD500', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.4 سم، سرعة 152 مم/ث بدقة 203 DPI أو 102 مم/ث بدقة 300 DPI، وتدعم الطباعة الحرارية وRibbon.', price: 0, image: 'products-images/zebra-zd500.jpg' },
    { id: 'imported-zebra-gk420t', name: 'Zebra GK420t', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.4 سم، سرعة 127 مم/ث، دقة 203 DPI، وتدعم الطباعة الحرارية وRibbon.', price: 0, image: 'products-images/zebra-gk420t.jpg' },
    { id: 'imported-zebra-gx420t', name: 'Zebra GX420t', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.4 سم، سرعة 152 مم/ث، دقة 203 DPI، وتدعم الطباعة الحرارية وRibbon.', price: 0, image: 'products-images/zebra-gx420t.jpg' },
    { id: 'imported-tsc-ttp245c', name: 'TSC TTP-245C', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 10.8 سم، سرعة 152 مم/ث، دقة 203 DPI، وتدعم الطباعة الحرارية وRibbon.', price: 0, image: 'products-images/tsc-ttp245c.jpg' },
    { id: 'imported-tsc-tdp225', name: 'TSC TDP-225', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة باركود بعرض 5.4 سم، سرعة 127 مم/ث، دقة 203 DPI، USB وSerial، وتدعم الطباعة الحرارية وRibbon.', price: 0, image: 'products-images/tsc-ttp225.jpg' },
    { id: 'imported-zebra-zxp-series-3', name: 'Zebra ZXP Series 3 (كارنيهات)', category: 'imported_printers', description: 'مستوردة، ضمان سنة، بالكرتونة والادابتور الأصلي والكابلات. طابعة كارنيهات ID بلاستيكية لبطاقات PVC القياسية، دقة 300 DPI، سرعة 700 كارت/ساعة أحادي اللون و195 كارت/ساعة بالألوان.', price: 0, image: 'products-images/zxp-series3.jpg' }
];
