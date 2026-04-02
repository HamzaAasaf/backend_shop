# Shop API - دليل الباك اند العربي

هذا المستودع يحتوي على باك اند API بسيط لمتجر إلكتروني يستخدم MongoDB Atlas كقاعدة بيانات. الهدف هو توفير واجهات RESTful يمكن استخدامها من تطبيق Flutter لتجربة شراء بسيطة مع دعم المستخدمين، المنتجات، والطلبات، إضافة إلى مسارات إدارة (Admin).

ما ستجده في المشروع
- بنية باك اند RESTful مبنية على Node.js + Express.
- نماذج البيانات: User, Product, Order, Cart.
- مصادقة آمنة باستخدام JWT وتشفير كلمات المرور باستخدام bcrypt.
- إدارة سلة الشراء (Cart) وتحويلها إلى Order.
- مسارات Admin لإدارة المنتجات والطلبات بآذونات إضافية.
- توثيق عربي شامِل عبر OpenAPI (ملف docs/ar/openapi-ar.yaml)، مع أمثلة طلب/استجابة.
- ملفات إعداد البيئة (.env) وآلية اتصال آمنة بـ MongoDB Atlas.
- سكريبت Seed للإدخال التجريبي للأدلة الأساسية أثناء التطوير.
- وجود ملف Postman Collection جاهز للاستخدام لاختبار الواجهات بسرعة.

الهدف من هذا الدليل
- تزويدك بفهم عميق لبنية المشروع وكيفية توجيه الطلبات إلى نقاط الوصول (Endpoints).
- توثيق كل نقطة وصول بالعربية، مع أمثلة الطلب والاستجابة.
- توفير خطوات تشغيل محلية سريعة مع أمثلة للبيانات وأساليب الاختبار.

محتوى المستودع ونطاق العمل
- ملفات رئيسية:
  - src/ (المنطقيات والأنماط): models، controllers، routes، middleware، وconfig.
- بنية البيانات (Models):
  - User: name, email (فريد)، passwordHash, role.
  - Product: title, description, price, stock, category, imageUrls.
  - Order: user, items, total, status.
  - Cart: user, items.
- المسارات (Routes):
  - /api/auth/register
  - /api/auth/login
  - /api/products
  - /api/products/:id
  - /api/cart
  - /api/cart/add
  - /api/cart/checkout
  - /api/cart/clear
  - /api/orders
  - /api/orders/:id
  - /api/admin/products
  - /api/admin/products/:id
  - /api/admin/orders
  - /api/admin/orders/:id
- توثيق OpenAPI بالعربية: docs/openapi-ar.yaml
- ملف بيئة النموذجي: .env.example
- مثال كولكشن Postman: postman/ShopAPI.postman_collection.json
- مثال بيئة Postman: postman/ShopAPI-Environment.postman_environment.json

كيفية البدء
1) انسخ المستودع إلى جهازك.
2) ضع ملف .env في جذر المشروع مع القيم المناسبة (MONGODB_URI، PORT، JWT_SECRET، JWT_EXPIRE/EXPIRES_IN).
3) اعذر تثبيت الحزم: npm install
4) ابدأ الخادم: npm run dev (للدورة التطوير) أو npm start.
5) استخدم Postman/Curl لاختبار المسارات كما هو موضح في القسم التالي.

الإعدادات الأساسية (Environment)
- .env: يحوي تكوين الاتصال ب MongoDB Atlas وإعداد JWT.
- MONGODB_URI: قيمة الاتصال ل Atlas.
- PORT: رقم المنفذ (يفضل 5000 أثناء التطوير).
- JWT_SECRET: كلمة سر التوقيع للتوكنات.
- JWT_EXPIRE / JWT_EXPIRES_IN: مدة صلاحية التوكن.

بنية المشروع (مختصر)
- src/config/
- src/models/
- src/controllers/
- src/middleware/
- src/routes/
- src/index.js
- docs/openapi-ar.yaml
- .env.example
- README.md

نطاق الوصول (Endpoints) بالعربية
- تسجيل مستخدم وتسجيل الدخول
- عرض المنتجات وتفاصيل المنتج
- إدارة السلة (Cart): عرض السلة، إضافة عناصر، الدفع/Checkout، ومسح السلة
- إنشاء وعرض الطلبات الخاصة بالمستخدم
- واجهات Admin لإدارة المنتجات والطلبات

أمثلة طلبات أساسية
POST {{baseUrl}}/api/auth/register
Body (مثال):
{
  "name": "أحمد",
  "email": "ahmed@example.com",
  "password": "secret"
}

- تسجيل الدخول
POST {{baseUrl}}/api/auth/login
Body (مثال):
{
  "email": "ahmed@example.com",
  "password": "secret"
}

- الحصول على قائمة المنتجات
GET {{baseUrl}}/api/products

- إضافة منتج إلى السلة
POST {{baseUrl}}/api/cart/add
Headers: Authorization: Bearer {{token}}
Body (مثال):
{
  "productId": "<PRODUCT_ID>",
  "quantity": 1
}

- إنشاء طلب
POST {{baseUrl}}/api/orders
Headers: Authorization: Bearer {{token}}
Body (مثال):
{
  "items": [{"productId": "<PRODUCT_ID>", "quantity": 1}]
}

ملحوظة: استخدم توكن JWT من تسجيل الدخول لتفعيل المسارات المحمية.

التوثيق OpenAPI بالعربية
- ملف openapi-ar.yaml موثّق بالعربية في docs/openapi-ar.yaml، ويتضمن المسارات الأساسية ومسارات Admin وال schemas للمستخدمين، المنتجات والطلبات.
- يمكن ربطه مع Swagger UI محلياً لإظهار واجهة توثيق تفاعلية.

التوسعة والتعديل
- يمكن إضافة cart أكثر تفصيلاً، تقارير، وواجهات Admin إضافية حسب احتياجك.
- قد يتطلب الأمر إضافة اختبارات باستخدام Jest/Mocha لاحقاً.
- Admin: إضافة منتجات مع تفاصيل متعددة
- دعم Variations: اللون، المقاس، الأبعاد، الوزن، مخزون محدد لكل فئة
- إضافة التفاصيل الإضافية ضمن details كـ key/value
- توليد تلقائي للمعرّف Product عبر MongoDB (id) عند الإنشاء
- الصور: imageUrls كحقل متعدد الروابط
