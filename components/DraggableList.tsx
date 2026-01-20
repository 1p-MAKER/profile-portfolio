'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FaGripVertical } from 'react-icons/fa';

interface DraggableListProps<T> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    itemKey: (item: T, index: number) => string;
}

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-start gap-2">
            {/* Drag Handle - Only this part is draggable */}
            <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-stone-200 rounded transition-colors flex-shrink-0"
                title="ドラッグして並び替え"
            >
                <FaGripVertical className="w-5 h-5 text-stone-500" />
            </div>

            {/* Content - Inputs are now clickable */}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}

export default function DraggableList<T>({
    items,
    onReorder,
    renderItem,
    itemKey,
}: DraggableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item, idx) => itemKey(item, idx) === active.id);
            const newIndex = items.findIndex((item, idx) => itemKey(item, idx) === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex);
                onReorder(newItems);
            }
        }
    };

    const itemIds = items.map((item, idx) => itemKey(item, idx));

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <SortableItem key={itemKey(item, index)} id={itemKey(item, index)}>
                            {renderItem(item, index)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
