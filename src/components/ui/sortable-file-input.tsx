import React from 'react'
import {
  DndContext,
  DragEndEvent,
  MeasuringStrategy,
  closestCenter,
} from '@dnd-kit/core'
import {
  AnimateLayoutChanges,
  SortableContext,
  arrayMove,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Upload, X } from 'lucide-react'
import { Button } from './button'

export type FileItem = {
  id: string
  file: File
  url: string
  position: number
}

type SortableFileInputProps = {
  id?: string
  name?: string
  value: FileItem[]
  onChange: (files: FileItem[]) => void
}

export function SortableFileInput({
  id,
  name,
  value,
  onChange,
}: SortableFileInputProps) {
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    const newFiles = Array.from(event.dataTransfer.files)
      .filter(
        (file) =>
          file.type.startsWith('image/') || file.type.startsWith('video/'),
      )
      .map((file, index) => ({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        position: value.length + index,
      }))

    onChange([...value, ...newFiles])
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
      .filter(
        (file) =>
          file.type.startsWith('image/') || file.type.startsWith('video/'),
      )
      .map((file, index) => ({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        position: value.length + index,
      }))

    onChange([...value, ...newFiles])
    event.target.value = ''
  }

  const handleDelete = (id: string) => {
    const updatedFiles = value.filter((file) => file.id !== id)

    updatePositions(updatedFiles)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = value.findIndex((item) => item.id === active.id)
      const newIndex = value.findIndex((item) => item.id === over?.id)
      const updatedFiles = arrayMove(value, oldIndex, newIndex)

      updatePositions(updatedFiles)
    }
  }

  const updatePositions = (files: FileItem[]) => {
    const updatedFiles = files.map((file, index) => ({
      ...file,
      position: index,
    }))
    onChange(updatedFiles)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <SortableContext items={value.map((file) => file.id)}>
          {value.length > 0 && (
            <ul className="grid grid-cols-3 gap-4">
              {value.map((file) => (
                <SortableItem
                  key={file.id}
                  id={file.id}
                  file={file}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </SortableContext>
      </DndContext>
      <label
        htmlFor={id}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="block cursor-pointer rounded-md border-2 border-dashed border-input p-5 text-center hover:border-ring"
      >
        <input
          id={id}
          type="file"
          name={name}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          hidden
          multiple
        />
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-x-1">
            <Upload className="h-3.5 w-3.5" />
            <p className="text-base font-medium">Upload images</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag and drop images or videos here or click to upload.
          </p>
        </div>
      </label>
    </div>
  )
}

type SortableItemProps = {
  id: string
  file: FileItem
  onDelete: (id: string) => void
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args)
  }

  return true
}

const SortableItem: React.FC<SortableItemProps> = ({ id, file, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      animateLayoutChanges,
      id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col items-center rounded border"
    >
      {file.file.type.startsWith('image/') && (
        <img
          src={file.url}
          alt={file.file.name}
          className="h-52 w-full object-cover"
        />
      )}
      {file.file.type.startsWith('video/') && (
        <video controls className="h-52 w-full object-cover">
          <source src={file.url} type={file.file.type} />
        </video>
      )}
      <div className="absolute right-2 top-2 flex">
        <Button
          type="button"
          variant="ghost"
          className="w-4 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onDelete(file.id)}
        >
          <X />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-4 cursor-grab"
          {...listeners}
          {...attributes}
        >
          <GripVertical />
        </Button>
      </div>
    </li>
  )
}
