import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/Drawer';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface DeleteDrawerProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteDrawer({
  isOpen,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onCancel()} side="bottom">
      <DrawerContent>
        <DrawerHeader className="text-center pt-8 pb-0">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {/* Content Area */}
        <div className="px-6 py-8 text-center">
          {itemName && (
            <div className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <HiOutlineExclamationTriangle className="w-5 h-5 text-red-400" />
              <p className="text-base text-gray-200">
                Delete <span className="font-semibold text-white">"{itemName}"</span>?
              </p>
            </div>
          )}
        </div>

        <DrawerFooter className="flex-row justify-center gap-4 p-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-8 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 hover:bg-white/[0.08]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(148,163,184,0.9)',
            }}
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-8 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 hover:opacity-90"
            style={{
              background: isDeleting ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.9)',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
