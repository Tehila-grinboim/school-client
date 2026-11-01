import { useState } from 'react';
import { Button, Modal, PageHeader } from '../../components/ui';

interface ClassItem {
  id: string;
  name: string;
  grade: string;
  homeroom: string;
  studentsCount: number;
}

interface GroupItem {
  id: string;
  name: string;
  classRef: string;
  studentsCount: number;
}

export default function Screen() {
  const [activeTab, setActiveTab] = useState<'classes' | 'groups'>('classes');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // שדות הטופס ליצירת כיתה/קבוצה
  const [frameName, setFrameName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [homeroom, setHomeroom] = useState<string>('');

  // נתוני דמה לכיתות בהתאם לתמונה
  const [classesData, setClassesData] = useState<ClassItem[]>([
    { id: '1', name: 'ז1', grade: "ז'", homeroom: 'נועם גולדשטיין', studentsCount: 28 },
    { id: '2', name: 'ז2', grade: "ז'", homeroom: 'טל חדד', studentsCount: 27 },
    { id: '3', name: 'ח1', grade: "ח'", homeroom: 'עמית כהן', studentsCount: 30 },
    { id: '4', name: 'ח2', grade: "ח'", homeroom: 'אופק שפירא', studentsCount: 29 },
    { id: '5', name: 'ח3', grade: "ח'", homeroom: 'רז אברהמי', studentsCount: 26 },
    { id: '6', name: 'ט1', grade: "ט'", homeroom: 'שחר ביטון', studentsCount: 31 },
  ]);

  // נתוני דמה לקבוצות לימוד
  const [groupsData, setGroupsData] = useState<GroupItem[]>([
    { id: 'g1', name: "הקבצה א' מתמטיקה", classRef: 'ז1', studentsCount: 15 },
    { id: 'g2', name: 'חוג גמרא עיון', classRef: 'חוצת-כיתה', studentsCount: 12 },
  ]);

  const handleCreateNew = async () => {
    if (!frameName.trim()) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (activeTab === 'classes') {
        setClassesData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName,
            grade: grade || 'ז\'',
            homeroom: homeroom || 'טרם הוגדר',
            studentsCount: 0,
          },
        ]);
      } else {
        setGroupsData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName,
            classRef: 'חוצת-כיתה',
            studentsCount: 0,
          },
        ]);
      }
      setIsModalOpen(false);
      setFrameName('');
      setGrade('');
      setHomeroom('');
    } catch (err) {
      console.error('Failed to create', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* כותרת המסך והפעולות */}
      <PageHeader
        title="כיתות וקבוצות לימוד"
        subtitle="רשימה, יצירה ושיוך תלמידים לכיתות ולקבוצות"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            {activeTab === 'classes' ? 'הוספת כיתה' : 'הוספת קבוצה'}
          </Button>
        }
      />

      {/* לשוניות ניווט (Tabs) */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'classes'
              ? 'border-primary text-primary'
              : 'border-transparent text-fg-secondary hover:text-fg'
          }`}
        >
          כיתות
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'groups'
              ? 'border-primary text-primary'
              : 'border-transparent text-fg-secondary hover:text-fg'
          }`}
        >
          קבוצות לימוד
        </button>
      </div>

      {/* טבלת הנתונים הראשית */}
      <div className="rounded-xl bg-surface border border-border overflow-hidden shadow-sm">
        {activeTab === 'classes' ? (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="p-4 font-semibold text-fg">שם</th>
                <th className="p-4 font-semibold text-fg">שכבה</th>
                <th className="p-4 font-semibold text-fg">מחנך</th>
                <th className="p-4 font-semibold text-fg">מספר תלמידים</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classesData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-fg-secondary">
                    אין כיתות להצגה
                  </td>
                </tr>
              ) : (
                classesData.map((cls) => (
                  <tr key={cls.id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="p-4 text-fg font-medium">{cls.name}</td>
                    <td className="p-4 text-fg-secondary">{cls.grade}</td>
                    <td className="p-4 text-fg-secondary">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {cls.homeroom.charAt(0)}
                        </span>
                        <span>{cls.homeroom}</span>
                      </div>
                    </td>
                    <td className="p-4 text-fg-secondary">{cls.studentsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="p-4 font-semibold text-fg">שם הקבוצה</th>
                <th className="p-4 font-semibold text-fg">שייכות כיתתית</th>
                <th className="p-4 font-semibold text-fg">מספר תלמידים</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groupsData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-fg-secondary">
                    אין קבוצות לימוד להצגה
                  </td>
                </tr>
              ) : (
                groupsData.map((grp) => (
                  <tr key={grp.id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="p-4 text-fg font-medium">{grp.name}</td>
                    <td className="p-4 text-fg-secondary">{grp.classRef}</td>
                    <td className="p-4 text-fg-secondary">{grp.studentsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* מודל יצירת כיתה או קבוצה חדשה */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={activeTab === 'classes' ? 'יצירת כיתה חדשה' : 'יצירת קבוצת לימוד חדשה'}
        description="הזן את פרטי המסגרת החדשה להוספה למערכת"
        confirmLabel="שמור וצור"
        confirmLoading={isLoading}
        onConfirm={handleCreateNew}
      >
        <div className="py-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-fg">שם הכיתה / קבוצה</label>
            <input
              type="text"
              className="px-3 py-2 rounded-lg border border-border bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={activeTab === 'classes' ? "לדוגמה: ז'1" : "לדוגמה: הקבצה א'"}
              value={frameName}
              onChange={(e) => setFrameName(e.target.value)}
            />
          </div>

          {activeTab === 'classes' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-fg">שכבה</label>
                <input
                  type="text"
                  className="px-3 py-2 rounded-lg border border-border bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="לדוגמה: ז'"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-fg">שם המחנך</label>
                <input
                  type="text"
                  className="px-3 py-2 rounded-lg border border-border bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="לדוגמה: נועם גולדשטיין"
                  value={homeroom}
                  onChange={(e) => setHomeroom(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}