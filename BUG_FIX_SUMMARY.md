# حل مشکل Maximum Update Depth Exceeded

## 🐛 مشکل

خطای "Maximum update depth exceeded" به دلیل infinite loop در useEffect رخ می‌داد.

### علت مشکل:
1. `updateHeader` و `clearHeader` در هر رندر جدید ایجاد می‌شدند
2. این باعث می‌شد useEffect در PageHeader مدام اجرا شود
3. هر بار که useEffect اجرا می‌شد، state تغییر می‌کرد و component دوباره رندر می‌شد

## ✅ راه حل

### 1. استفاده از useCallback در Context
```jsx
const updateHeader = useCallback((data) => {
  setHeaderData(data);
}, []);

const clearHeader = useCallback(() => {
  setHeaderData({
    title: '',
    subtitle: '',
    action: null,
    backAction: null,
  });
}, []);
```

### 2. استفاده از useMemo در PageHeader
```jsx
const headerData = useMemo(() => ({
  title: title || '',
  subtitle: subtitle || '',
  action: action || null,
  backAction: backAction || null,
}), [title, subtitle, action, backAction]);
```

## 🔧 تغییرات انجام شده

### فایل: `src/contexts/page-header-context.jsx`
- اضافه کردن `useCallback` برای `updateHeader` و `clearHeader`
- اضافه کردن import برای `useCallback`

### فایل: `src/components/page-header/page-header.jsx`
- استفاده از `useMemo` برای headerData
- بهبود dependency array در useEffect
- اضافه کردن import برای `useMemo`

## 🎯 نتیجه

- ✅ خطای infinite loop حل شد
- ✅ Performance بهبود یافت (کمتر re-render)
- ✅ Memory leak جلوگیری شد
- ✅ سرور dev بدون خطا شروع می‌شود

## 📚 درس آموخته

هنگام استفاده از useEffect با dependencies:
1. همیشه از `useCallback` برای functions استفاده کنید
2. از `useMemo` برای objects پیچیده استفاده کنید
3. dependency array را دقیق تعریف کنید
4. از inline objects و functions در dependencies خودداری کنید

مشکل حل شد و سیستم هدر آماده استفاده است! 🚀