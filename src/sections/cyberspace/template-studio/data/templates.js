const template110Html = `
<div style="width:1920px;height:1080px;background-color:#f5f5f5;position:relative;overflow:hidden;">
  <img
    src="/templates/110/bg.png"
    alt="background"
    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;"
  />
  <div style="position:absolute;top:147px;left:106px;width:644px;height:760px;z-index:1;">
    <img
      src="{image}"
      alt="{name}"
      style="width:100%;height:100%;border-radius:44px;object-fit:cover;"
    />
  </div>
  <div style="position:absolute;top:250px;right:85px;background-color:#02879f;border-radius:15px;padding:18px 34px;z-index:1;">
    <p style="font-family:Nian-Black;font-size:100px;line-height:1;color:white;margin:10px 0 30px 0px;">{name}</p>
  </div>
  <div style="position:absolute;top:480px;right:85px;background-color:#02879f;border-radius:15px;padding:40px;z-index:1;">
    <p style="font-family:Nian-Black;font-size:80px;line-height:1;color:white;margin:0;">{role}</p>
  </div>
</div>
`;

const template120Html = `
<div style="width:1080px;height:1080px;position:relative;overflow:hidden;background:linear-gradient(135deg,#112031,#294a66);">
  <img
    src="{image1}"
    alt="{name1}"
    style="position:absolute;left:120px;top:220px;width:300px;height:400px;border-radius:36px;object-fit:cover;border:10px solid rgba(255,255,255,0.4);"
  />
  <img
    src="{image2}"
    alt="{name2}"
    style="position:absolute;right:120px;bottom:220px;width:400px;height:300px;border-radius:36px;object-fit:cover;border:10px solid rgba(255,255,255,0.4);"
  />
  <div style="position:absolute;right:140px;top:270px;max-width:1100px;">
    <p style="margin:0;color:#b3d8ff;font-family:'Nian-Black',sans-serif;font-size:52px;">کارت معرفی</p>
    <p style="margin:24px 0 0;color:#ffffff;font-family:'Nian-Black',sans-serif;font-size:132px;line-height:1.05;">{name}</p>
    <p style="margin:24px 0 0;color:#8fe6ff;font-family:'Nian-Black',sans-serif;font-size:76px;">{role}</p>
    <p style="margin:40px 0 0;color:#dbe8f3;font-family:'Nian-Black',sans-serif;font-size:42px;">{tagline}</p>
  </div>
</div>
`;

const template130Html = `
<div style="width:1920px;height:1080px;position:relative;overflow:hidden;background:#0f172a;">
  <img
    src="{image}"
    alt="{title}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.5;"
  />
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,0.35),rgba(15,23,42,0.92));"></div>
  <div style="position:absolute;right:120px;left:120px;bottom:110px;z-index:1;">
    <p style="margin:0;color:#7dd3fc;font-family:'Nian-Black',sans-serif;font-size:48px;">{category}</p>
    <p style="margin:18px 0 0;color:#ffffff;font-family:'Nian-Black',sans-serif;font-size:110px;line-height:1.15;">{title}</p>
    <p style="margin:26px 0 0;color:#e2e8f0;font-family:'Nian-Black',sans-serif;font-size:50px;">{subtitle}</p>
  </div>
</div>
`;

export const templateConfigs = [
  {
    id: '110',
    name: 'قالب گواهی - دو خط',
    description: 'قالب با نام، سمت و تصویر',
    category: 'انتصابات',
    width: 1920,
    height: 1080,
    html: template110Html,
    inputs: [
      {
        name: 'name',
        type: 'text',
        label: 'نام',
        placeholder: 'نام را وارد کنید',
        default: 'مجید گودینی',
        required: true,
      },
      {
        name: 'role',
        type: 'text',
        label: 'سمت',
        placeholder: 'سمت را وارد کنید',
        default: 'ریاست مدرسه تحول',
        required: true,
      },
      {
        name: 'image',
        type: 'image',
        label: 'تصویر',
        accept: 'image/*',
        required: false,
        default: '/templates/110/bg.png',
        width: 644,
        height: 760,
      },
    ],
  },
  {
    id: '120',
    name: 'کارت معرفی - یک خط توضیح',
    description: 'کارت معرفی با تصویر و توضیح کوتاه',
    category: 'معرفی',
    width: 1080,
    height: 1080,
    html: template120Html,
    inputs: [
      { name: 'name', type: 'text', label: 'نام', default: 'سارا محمدی', required: true },
      { name: 'role', type: 'text', label: 'سمت', default: 'مدیر توسعه محصول', required: true },
      {
        name: 'tagline',
        type: 'text',
        label: 'توضیح کوتاه',
        default: 'خلق تجربه‌های یادگیری هوشمند برای نسل آینده',
      },
      {
        name: 'image1',
        type: 'image',
        label: 'تصویر',
        accept: 'image/*',
        default: '/templates/110/bg.png',
        width: 300,
        height: 400,
      },
      {
        name: 'image2',
        type: 'image',
        label: 'تصویر',
        accept: 'image/*',
        default: '/templates/110/bg.png',
        width: 400,
        height: 300,
      },
    ],
  },
  {
    id: '130',
    name: 'بنر شبکه اجتماعی',
    description: 'بنر تبلیغاتی مناسب انتشار در شبکه‌های اجتماعی',
    category: 'رسانه',
    width: 1920,
    height: 1080,
    html: template130Html,
    inputs: [
      {
        name: 'category',
        type: 'text',
        label: 'دسته‌بندی',
        default: 'اطلاعیه ویژه',
        required: true,
      },
      {
        name: 'title',
        type: 'text',
        label: 'تیتر',
        default: 'ثبت‌نام دوره جدید آغاز شد',
        required: true,
      },
      {
        name: 'subtitle',
        type: 'text',
        label: 'زیرتیتر',
        default: 'برای دریافت اطلاعات بیشتر به سایت مراجعه کنید',
      },
      {
        name: 'image',
        type: 'image',
        label: 'تصویر پس‌زمینه',
        accept: 'image/*',
        default: '/templates/110/bg.png',
        width: 1920,
        height: 1080,
      },
    ],
  },
];

export const templateConfigById = templateConfigs.reduce((acc, template) => {
  acc[template.id] = template;
  return acc;
}, {});
