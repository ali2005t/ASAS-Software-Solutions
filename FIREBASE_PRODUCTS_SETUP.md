# إعداد صلاحيات كتالوج المنتجات

صفحة المنتجات تقرأ سعر العميل والبيانات العامة من `store_products` فقط. السعر الأساسي الذي أرسله صاحب المشروع محفوظ في مجموعة خاصة `store_product_costs` بحقل `basePrice`، ولا يستطيع قراءته إلا مدير الكتالوج. طلبات الزوار تُحفظ في `store_orders`؛ يمكن للزوار إنشاء طلب بعد تحديد سعر العميل، لكن القراءة والتعديل والحذف للمدير فقط. من صفحة «طلبات العملاء» في لوحة الإدارة يمكن تأكيد استلام الدفع (`paid`) أو إلغاء الطلب (`cancelled`) أو حذفه نهائيًا؛ التقارير تحتسب العمولة للطلبات المدفوعة فقط.

## تفعيل مدير الكتالوج

1. سجّل الدخول إلى `admin.html` بحساب الإدارة.
2. افتح «إدارة المنتجات». إذا لم يكن الحساب مفعّلًا، ستظهر قيمة UID الخاصة به.
3. من Firebase Console أضف مستندًا في مجموعة `store_admins`، واجعل **معرّف المستند هو UID**، وأضف الحقل `enabled` بقيمة Boolean تساوي `true`.
4. افتح قواعد Firestore وStorage الحالية، ثم **ادمج** المقاطع التالية معها. لا تستبدل القواعد الحالية بها؛ بقية صفحات المشروع تستخدم مجموعات أخرى.

## قواعد Firestore

أضف الدوال والمطابقات التالية داخل كتلة `service cloud.firestore` الحالية، تحت `match /databases/{database}/documents`:

```text
function isStoreAdmin() {
  return request.auth != null
    && exists(/databases/$(database)/documents/store_admins/$(request.auth.uid))
    && get(/databases/$(database)/documents/store_admins/$(request.auth.uid)).data.enabled == true;
}

match /store_admins/{uid} {
  allow get: if request.auth != null && request.auth.uid == uid;
  allow list: if isStoreAdmin();
  allow create, update, delete: if false;
}

match /store_products/{productId} {
  allow read: if isStoreAdmin() || resource.data.active == true;
  allow create, update, delete: if isStoreAdmin();
}

match /store_product_costs/{productId} {
  allow read, create, update, delete: if isStoreAdmin();
}

match /store_settings/{settingId} {
  allow get, create, update: if isStoreAdmin();
  allow list, delete: if false;
}

match /store_orders/{orderId} {
  allow create: if request.resource.data.keys().hasAll([
      'customerName', 'phone', 'productId', 'productName', 'unitPrice', 'quantity', 'status', 'createdAt'
    ])
    && request.resource.data.keys().hasOnly([
      'customerName', 'phone', 'productId', 'productName', 'unitPrice', 'quantity', 'status', 'createdAt'
    ])
    && request.resource.data.customerName is string
    && request.resource.data.customerName.size() >= 1
    && request.resource.data.customerName.size() <= 100
    && request.resource.data.phone is string
    && request.resource.data.phone.size() >= 8
    && request.resource.data.phone.size() <= 20
    && request.resource.data.productId is string
    && request.resource.data.productName is string
    && request.resource.data.unitPrice is number
    && request.resource.data.unitPrice > 0
    && request.resource.data.quantity is int
    && request.resource.data.quantity >= 1
    && request.resource.data.quantity <= 50
    && request.resource.data.status == 'new'
    && request.resource.data.createdAt == request.time
    && exists(/databases/$(database)/documents/store_products/$(request.resource.data.productId))
    && get(/databases/$(database)/documents/store_products/$(request.resource.data.productId)).data.active == true
    && get(/databases/$(database)/documents/store_products/$(request.resource.data.productId)).data.name == request.resource.data.productName
    && get(/databases/$(database)/documents/store_products/$(request.resource.data.productId)).data.price == request.resource.data.unitPrice;
  allow read, update, delete: if isStoreAdmin();
}
```

قواعد Firestore تجمع الصلاحيات المتطابقة بمنطق السماح إذا سمحت أي قاعدة. لو عندك قاعدة عامة مثل `match /{document=**} { allow read, write: if true; }` أو سماح قراءة واسع للمستخدمين، ضيّقها قبل الاعتماد على خصوصية `store_product_costs`؛ إضافة القواعد أعلاه وحدها لا تلغي سماحًا أوسع موجودًا.

## قواعد Storage

أضف المطابقة التالية داخل كتلة `service firebase.storage` الحالية:

```text
function isStoreAdmin(uid) {
  let adminPath = /databases/(default)/documents/store_admins/$(uid);
  return request.auth != null
    && request.auth.uid == uid
    && firestore.exists(adminPath)
    && firestore.get(adminPath).data.enabled == true;
}

match /store-products/{uid}/{productId}/{fileName} {
  allow read: if true;
  allow create, update: if isStoreAdmin(uid)
    && request.resource.size <= 5 * 1024 * 1024
    && request.resource.contentType.matches('image/(jpeg|png|webp|gif)');
  allow delete: if isStoreAdmin(uid);
}
```

تستخدم قواعد Storage هنا قراءة مستند Firestore للتحقق من دور المدير؛ سيطلب Firebase تفعيل الربط والصلاحيات اللازمة عند حفظ القاعدة لأول مرة. راجع وثائق [ربط قواعد Storage بـ Firestore](https://firebase.google.com/docs/storage/security/rules-conditions#enhance_with_cloud_firestore) و[التحقق من نوع الملف وحجمه](https://firebase.google.com/docs/storage/security#data_validation).

## البيانات الأولية

بعد تفعيل UID والقواعد، شغّل `npm run dev` للتطوير المحلي وافتح `admin.html`. إذا كان الكتالوج فارغًا، ستضيف اللوحة المنتجات الـ28 وصورها من `products-images` إلى Firestore. وتحدّث مرة واحدة أسماء المنتجات ومواصفاتها، وتخزن الأسعار الأساسية التي أرسلها صاحب المشروع في `store_product_costs`. سعر العميل يبدأ بدون تحديد؛ اكتبه يدويًا في الخانة الثانية من لوحة المنتج، وهذا وحده يظهر للزوار ويُستخدم في الطلبات. لا تُضاف عمولة تلقائيًا. عند النشر، يجب أن تتضمن نسخة Vercel مجلد `api` أيضًا.

تعبئة الأسعار الأساسية الأولية تستخدم مسار API محميًا بقواعد Firestore، ويرسل Firebase ID token؛ [وثائق REST API](https://firebase.google.com/docs/firestore/use-rest-api) تشرح تطبيق قواعد Firestore على الطلبات. عند أول فتح بعد هذا التحديث، تُحدّث التهيئة الأسعار الأساسية الـ28 مرة واحدة. بعد ذلك لا تعيد الكتابة فوق أي تعديل يدوي للسعر الأساسي أو سعر العميل.

إذا كان الكتالوج قد أُنشئ قبل إضافة الأسعار الخاصة، ستحذف اللوحة أي حقل `basePrice` أو `wholesalePrice` أو `originalPrice` قديم من مستندات المنتجات العامة، ثم تحفظ السعر الأساسي في المجموعة الخاصة. لن يظهر السعر الأساسي للزوار، ولن يسمح الموقع بطلب منتج حتى تكتب له سعر العميل.

بعد ذلك تصبح بيانات الكتالوج من Firestore، ولا يعيد النظام إنشاء المنتجات التي تحذفها.
