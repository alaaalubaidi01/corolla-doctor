# كاردكتور كورولا — تشغيل

محليا (يحتاج Node 18 أو أحدث، بدون npm install):
    node server.js
ثم افتح http://localhost:3000

النشر: ارفع المجلد على أي استضافة Node (Render, Railway, Fly.io, VPS) وشغّل `npm start`.
مهم: خزّن مجلد data على قرص دائم، وإلا تضيع الرسائل عند إعادة التشغيل.
على الموبايل: افتح الرابط في Chrome/Safari واختر "إضافة إلى الشاشة الرئيسية".

إدارة المحتوى: عدّل data/shops.json لإضافة ورش (name, area, spec, phone, verified).
الملاحظات تتجمع في data/feedback.json.
