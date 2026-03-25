export interface Subtitle {
    start: number;
    end: number;
    text: string;
}

export const VIDEO_SUBTITLES: Record<string, Record<string, Subtitle[]>> = {
    "Step_1_Light_Wash": {
        "en": [
            { start: 38, end: 41, text: "Welcome to SkyGloss Professional Training." },
            { start: 41, end: 46, text: "Step 1: The Light Wash. Essential for surface preparation." },
            { start: 46, end: 50, text: "Gently rinse the vehicle to remove loose contaminants." },
            { start: 50, end: 54, text: "Use our pH balanced soap for a safe, streak-free finish." },
            { start: 54, end: 57, text: "Always wash from the top down using a microfiber mitt." },
            { start: 57, end: 60, text: "Thoroughly rinse before moving to the decontamination stage." }
        ],
        "ur": [
            { start: 38, end: 41, text: "اسکائی گلوس پروفیشنل ٹریننگ میں خوش آمدید۔" },
            { start: 41, end: 46, text: "مرحلہ 1: ہلکا واش۔ سطح کی تیاری کے لیے ضروری ہے۔" },
            { start: 46, end: 50, text: "ڈھیلے آلودگیوں کو دور کرنے کے لیے گاڑی کو آہستہ سے دھو لیں۔" },
            { start: 50, end: 54, text: "محفوظ اور لکیروں سے پاک فنش کے لیے ہمارا پی ایچ متوازن صابن استعمال کریں۔" },
            { start: 54, end: 57, text: "ہمیشہ مائیکرو فائبر مٹ کا استعمال کرتے ہوئے اوپر سے نیچے تک دھو لیں۔" },
            { start: 57, end: 60, text: "ڈیکونٹیمینیشن کے مرحلے پر جانے سے پہلے اچھی طرح دھو لیں۔" }
        ],
        "ar": [
            { start: 38, end: 41, text: "مرحباً بكم في تدريب SkyGloss الاحترافي." },
            { start: 41, end: 46, text: "الخطوة 1: الغسيل الخفيف. ضروري لتحضير السطح." },
            { start: 46, end: 50, text: "اشطف السيارة بلطف لإزالة الملوثات السائبة." },
            { start: 50, end: 54, text: "استخدم صابوننا المتوازن لضمان الحصول على لمسة نهائية آمنة وخالية من الخطوط." },
            { start: 54, end: 57, text: "اغسل دائماً من الأعلى إلى الأسفل باستخدام قفاز غسيل من الألياف الدقيقة." },
            { start: 57, end: 60, text: "اشطف جيداً قبل الانتقال إلى مرحلة إزالة التلوث." }
        ]
    },
    "Step_2_Vehicle_Inspection": {
        "en": [
            { start: 0, end: 4, text: "Step 2: Professional Vehicle Inspection." },
            { start: 4, end: 9, text: "Critically examine the clearcoat for integrity and damage." },
            { start: 9, end: 15, text: "Identify any repainted areas or thin spots before proceeding." }
        ],
        "ur": [
            { start: 0, end: 4, text: "مرحلہ 2: پیشہ ورانہ گاڑی کا معائنہ۔" },
            { start: 4, end: 9, text: "انٹیگریٹی اور نقصان کے لیے کلیئرکوٹ کا تنقیدی معائنہ کریں۔" },
            { start: 9, end: 15, text: "آگے بڑھنے سے پہلے کسی بھی دوبارہ پینٹ شدہ جگہوں یا پتلی جگہوں کی شناخت کریں۔" }
        ]
    },
    "Step_3_Remove_Attachments": {
        "en": [
            { start: 0, end: 5, text: "Step 3: Removing Attachments and Emblems." },
            { start: 5, end: 10, text: "Use professional fishing line to safely separate badges." },
            { start: 10, end: 15, text: "Clean residue with adhesive remover for a smooth surface." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 3: اٹیچمنٹ اور نشانات کو ہٹانا۔" },
            { start: 5, end: 10, text: "بیجز کو محفوظ طریقے سے الگ کرنے کے لیے پیشہ ورانہ فشنگ لائن کا استعمال کریں۔" },
            { start: 10, end: 15, text: "ہموار سطح کے لیے چپکنے والی چیزوں کو ہٹانے والے کے ساتھ باقیات کو صاف کریں۔" }
        ]
    },
    "Step_4_Exfoliate": {
        "en": [
            { start: 0, end: 5, text: "Step 4: Surface Exfoliation Process." },
            { start: 5, end: 12, text: "Use a specialized clay bar or exfoliation pad to remove bonded contaminants." },
            { start: 12, end: 18, text: "Ensure the surface is lubricated to prevent any marring." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 4: سطح کے اخراج کا عمل۔" },
            { start: 5, end: 12, text: "پھنسے ہوئے آلودگیوں کو دور کرنے کے لیے خاص کلے بار یا ایکسفولیئشن پیڈ کا استعمال کریں۔" },
            { start: 12, end: 18, text: "یقینی بنائیں کہ سطح چکنی ہے تاکہ کسی بھی قسم کے نشانات سے بچا جا سکے۔" }
        ]
    },
    "Step_5_Heavy_Wash": {
        "en": [
            { start: 0, end: 5, text: "Step 5: Final Heavy Wash." },
            { start: 5, end: 10, text: "Remove all remaining residue from the exfoliation stage." },
            { start: 10, end: 15, text: "Prepare the surface for the chemical etching phase." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 5: آخری بھاری واش۔" },
            { start: 5, end: 10, text: "ایکسفولیئشن کے مرحلے سے تمام باقیات کو ہٹا دیں۔" },
            { start: 10, end: 15, text: "کیمیائی اینچنگ کے مرحلے کے لیے سطح تیار کریں۔" }
        ]
    },
    "Step_6_Etch": {
        "en": [
            { start: 0, end: 5, text: "Step 6: Chemical Surface Etching." },
            { start: 5, end: 10, text: "Apply the etching solution to create a perfect bond for Fusion." },
            { start: 10, end: 15, text: "Ensure even coverage across the entire panel." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 6: کیمیائی سطح کی اینچنگ۔" },
            { start: 5, end: 10, text: "فیوژن کے لیے بہترین بانڈ بنانے کے لیے اینچنگ سلوشن کا استعمال کریں۔" },
            { start: 10, end: 15, text: "پورے پینل پر یکساں کوریج کو یقینی باسن۔" }
        ]
    },
    "Step_7_Mask": {
        "en": [
            { start: 0, end: 5, text: "Step 7: Masking and Protection." },
            { start: 5, end: 10, text: "Apply high-quality masking tape to protect trim and moldings." },
            { start: 10, end: 15, text: "Ensure clean, straight lines for a professional application." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 7: ماسکنگ اور تحفظ۔" },
            { start: 5, end: 10, text: "ٹرم اور مولڈنگز کی حفاظت کے لیے اعلیٰ معیار کی ماسکنگ ٹیپ کا استعمال کریں۔" },
            { start: 10, end: 15, text: "پیشہ ورانہ کام کے لیے صاف اور سیدھی لائنوں کو یقینی بنائیں۔" }
        ]
    },
    "Step_8_Mixing_Fusion": {
        "en": [
            { start: 0, end: 5, text: "Step 8: Mixing the Fusion Coating." },
            { start: 5, end: 10, text: "Mix Element and Aether in a 1:1 ratio. Important for the chemical bond." },
            { start: 10, end: 15, text: "Allow 10 minutes of induction time before beginning application." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 8: فیوژن کوٹنگ ملانا۔" },
            { start: 5, end: 10, text: "ایلیمنٹ اور ایتھر کو 1:1 کے تناسب سے ملائیں۔ کیمیائی بانڈ کے لیے اہم ہے۔" },
            { start: 10, end: 15, text: "استعمال شروع کرنے سے پہلے 10 منٹ کا وقت دیں۔" }
        ]
    },
    "Step_9_First_Pour": {
        "en": [
            { start: 0, end: 5, text: "Step 9: Preparing the Applicator (First Pour)." },
            { start: 5, end: 12, text: "Ensure the applicator is fully saturated on all corners to avoid dry spots." },
            { start: 12, end: 18, text: "Use approximately 15-30 mL of Fusion for the initial loading." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 9: ایپلیکیٹر کی تیاری (پہلا پور)۔" },
            { start: 5, end: 12, text: "یقینی بنائیں کہ ایپلیکیٹر تمام کونوں سے پوری طرح سیر ہے تاکہ خشک جگہوں سے بچا جا سکے۔" },
            { start: 12, end: 18, text: "ابتدائی لوڈنگ کے لیے تقریباً 15-30 ملی لیٹر فیوژن استعمال کریں۔" }
        ]
    },
    "Step_10_Tack_Cloth": {
        "en": [
            { start: 0, end: 5, text: "Step 10: Final Prep with Tack Cloth." },
            { start: 5, end: 10, text: "Gently wipe the surface right before application to remove lint." },
            { start: 10, end: 15, text: "Use light pressure to avoid leaving sticky residue on the paint." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 10: ٹیک کلاتھ کے ساتھ آخری تیاری۔" },
            { start: 5, end: 10, text: "لنٹ کو ہٹانے کے لیے استعمال سے پہلے سطح کو آہستہ سے صاف کریں۔" },
            { start: 10, end: 15, text: "پینٹ پر چپچپا باقیات چھوڑنے سے بچنے کے لیے ہلکا دباؤ استعمال کریں۔" }
        ]
    },
    "Step_11_Apply_Fusion": {
        "en": [
            { start: 0, end: 5, text: "Step 11: Applying Fusion to the Vehicle." },
            { start: 5, end: 12, text: "Use 50% overlap and medium pressure for a level, consistent finish." },
            { start: 12, end: 20, text: "Maintain a steady pace and cross-hatch to ensure full coverage." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 11: گاڑی پر فیوژن کا استعمال۔" },
            { start: 5, end: 12, text: "ہموار اور مستقل فنش کے لیے 50 فیصد اوورلیپ اور درمیانے دباؤ کا استعمال کریں۔" },
            { start: 12, end: 20, text: "مکمل کوریج کو یقینی بنانے کے لیے مستقل رفتار برقرار رکھیں۔" }
        ]
    },
    "Step_12_Quality_Check": {
        "en": [
            { start: 0, end: 5, text: "Step 12: Final Quality Inspection." },
            { start: 5, end: 10, text: "Examine every panel for drips, lines, or missed spots under good lighting." },
            { start: 10, end: 15, text: "Correct any issues immediately before Fusion begins to cure." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 12: آخری کوالٹی کا معائنہ۔" },
            { start: 5, end: 10, text: "اچھی روشنی میں ہر پینل پر قطروں، لائنوں یا چھوٹی ہوئی جگہوں کا معائنہ کریں۔" },
            { start: 10, end: 15, text: "فیوژن کے خشک ہونے سے پہلے کسی بھی مسئلے کو فوری طور پر درست کریں۔" }
        ]
    },
    "Step_13_Clean_Applicator": {
        "en": [
            { start: 0, end: 5, text: "Step 13: Cleaning the Applicator Bottle." },
            { start: 5, end: 12, text: "Rinse the bottle thoroughly with acetone to prevent Fusion buildup." },
            { start: 12, end: 18, text: "A clean bottle ensures the integrity of your next application." }
        ],
        "ur": [
            { start: 0, end: 5, text: "مرحلہ 13: ایپلیکیٹر کی بوتل کی صفائی۔" },
            { start: 5, end: 12, text: "فیوژن بننے سے روکنے کے لیے بوتل کو ایسیٹون سے اچھی طرح دھو لیں۔" },
            { start: 12, end: 18, text: "صاف بوتل آپ کے اگلے کام کی سالمیت کو یقینی بناتی ہے۔" }
        ]
    },
    "Aftercare": {
        "en": [
            { start: 0, end: 5, text: "Phase E: Post-Application Aftercare." },
            { start: 5, end: 10, text: "Inform the customer: Do not wash the vehicle for 14 days." },
            { start: 10, end: 15, text: "Apply SkyGloss SEAL after 12 hours for initial protection." }
        ],
        "ur": [
            { start: 0, end: 5, text: "فیز ای: استعمال کے بعد کی دیکھ بھال۔" },
            { start: 5, end: 10, text: "گاہک کو مطلع کریں: 14 دن تک گاڑی نہ دھو لیں۔" },
            { start: 10, end: 15, text: "ابتدائی تحفظ کے لیے 12 گھنٹے بعد اسکائی گلوس سیل استعمال کریں۔" }
        ]
    },
    "Troubleshooting": {
        "en": [
            { start: 0, end: 5, text: "Troubleshooting common application issues." },
            { start: 5, end: 12, text: "If a panel has issues, strip it with Etch immediately and redo." },
            { start: 12, end: 20, text: "Refer to the manual for sticky application or integrity concerns." }
        ],
        "ur": [
            { start: 0, end: 5, text: "عام استعمال کے مسائل کو حل کرنا۔" },
            { start: 5, end: 12, text: "اگر کسی پینل میں مسئلہ ہے تو اسے فوری طور پر ایچ سے صاف کریں اور دوبارہ کریں۔" },
            { start: 12, end: 20, text: "چپچپا استعمال یا سالمیت کے خدشات کے لیے مینوئل دیکھیں۔" }
        ]
    }
};
