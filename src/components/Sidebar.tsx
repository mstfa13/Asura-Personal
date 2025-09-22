import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  TrendingUp,
  Dumbbell,
  Zap,
  Settings,
  Menu,
  X,
  Music2,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityStore } from '@/lib/activityStore';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateSelection, TemplateType } from '@/components/TemplateSelection';

const navigation = [
  { name: 'Progress', href: '/', icon: TrendingUp },
  { name: 'Daily Activities', href: '/daily-activities', icon: Home },
  { name: 'Boxing', href: '/boxing', icon: Zap, key: 'boxing' as const },
  { name: 'Gym', href: '/gym', icon: Dumbbell, key: 'gym' as const },
  { name: 'Oud', href: '/oud', icon: Music2, key: 'oud' as const },
  { name: 'Spanish', href: '/spanish', icon: Languages, key: 'spanish' as const },
  { name: 'German', href: '/german', icon: Languages, key: 'german' as const },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [showAdd, setShowAdd] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [template, setTemplate] = useState<TemplateType>('none');
  const customMap = useActivityStore((s) => s.customActivities);
  const custom = useMemo(() => Object.entries(customMap).map(([slug, v]) => ({ slug, ...v })), [customMap]);
  const addCustom = useActivityStore((s) => s.addCustomActivity);
  const setMinimal = useActivityStore((s) => s.hydrateFromServer);
  const deleteCustom = useActivityStore((s) => s.deleteCustomActivity);
  const hidden = useActivityStore((s) => s.hiddenActivities);
  const minimal = useActivityStore((s) => s.minimalMode);
  const hideCore = useActivityStore((s) => s.hideActivity);
  const restoreCore = useActivityStore((s) => s.restoreActivity);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <img
                src="/Asura-png.png"
                alt="App logo"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LifeTracker
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Core activities */}
            {navigation
              .filter((item) => !minimal || item.href === '/' || item.href === '/daily-activities')
              .filter((item) => !('key' in item && hidden[(item as any).key]))
              .map((item) => {
              const isActive = location.pathname === item.href;
              const canDelete = 'key' in item; // only core trackables
              return (
                <div key={item.name} className="flex items-center justify-between group">
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                  {canDelete && (
                    <button
                      className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                      title="Delete"
                      onClick={() => {
                        const key = (item as any).key as 'boxing'|'gym'|'oud'|'spanish'|'german';
                        if (!confirm(`Hide activity \"${item.name}\"? You can restore it later from Add Activity.`)) return;
                        hideCore(key);
                        if (isActive) window.location.href = '/';
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}

            {/* Inline custom activities within list */}
            {custom.map((c) => {
              const href = `/activity/${c.slug}`;
              const isActive = location.pathname === href;
              return (
                <div key={c.slug} className="flex items-center justify-between group">
                  <Link
                    to={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Languages className="w-5 h-5 mr-3" />
                    {c.name}
                  </Link>
                  <button
                    className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                    title="Delete"
                    onClick={() => {
                      if (!confirm(`Delete activity \"${c.name}\"?`)) return;
                      deleteCustom(c.slug);
                      if (isActive) {
                        window.location.href = '/';
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Add Activity */}
            <Dialog open={showAdd} onOpenChange={(o) => { setShowAdd(o); if (!o) { setActivityName(''); setTemplate('none'); } }}>
              <DialogTrigger asChild>
                <Button className="w-full mt-2" variant="outline">+ Add Activity</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div>
                  <label className="text-sm font-medium text-gray-700">Activity name</label>
                  <Input className="mt-1" value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="e.g., Reading" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Template</div>
                  <TemplateSelection value={template} onChange={setTemplate} />
                </div>
                {/* Restore hidden core activities */}
                {Object.entries(hidden).filter(([, v]) => v).length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Restore core activities</div>
                    <div className="space-y-2">
                      {navigation.filter((n) => 'key' in n && hidden[(n as any).key]).map((n) => {
                        const Icon = (n as any).icon;
                        const key = (n as any).key as 'boxing'|'gym'|'oud'|'spanish'|'german';
                        return (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <div className="text-gray-700 flex items-center">
                              <Icon className="w-4 h-4 mr-2" />{n.name}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => restoreCore(key)}>Restore</Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const raw = activityName.trim();
                      if (!raw) return;
                      const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      addCustom(slug, raw, template);
                      // Turn off minimal mode once user adds content
                      setMinimal({ minimalMode: false });
                      setActivityName('');
                      setTemplate('none');
                      setShowAdd(false);
                      setIsOpen(false);
                      // Navigate via anchor, since sidebar may be outside router hooks
                      window.location.href = `/activity/${slug}`;
                    }}
                  >Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              Track your life, achieve your goals
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
