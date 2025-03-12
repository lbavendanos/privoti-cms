'use client'

import { uuid } from '@/lib/utils'
import { useCallback } from 'react'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
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
import { Button } from './button'
import { GripVertical, Upload, X } from 'lucide-react'

type FileItem = {
  uuid: string
  id?: string
  name: string
  type: string
  url: string
  rank: number
  file?: File
}

type SortableFileInputProps = {
  id?: string
  name?: string
  value: FileItem[]
  onChange: React.Dispatch<React.SetStateAction<FileItem[]>>
}

export function SortableFileInput({
  id,
  name,
  value,
  onChange,
}: SortableFileInputProps) {
  const handleFiles = useCallback(
    (files: FileList) => {
      return Array.from(files)
        .filter(
          (file) =>
            file.type.startsWith('image/') || file.type.startsWith('video/'),
        )
        .map((file, index) => ({
          uuid: uuid(),
          name: file.name,
          type: file.type.split('/')[0],
          url: URL.createObjectURL(file),
          rank: value.length + index,
          file,
        }))
    },
    [value],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault()

      const newFiles = handleFiles(event.dataTransfer.files)

      onChange([...value, ...newFiles])
    },
    [value, onChange, handleFiles],
  )

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = handleFiles(
        event.target.files ?? ([] as unknown as FileList),
      )

      onChange([...value, ...newFiles])
      event.target.value = ''
    },
    [value, onChange, handleFiles],
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault()
    },
    [],
  )

  const updatePositions = useCallback(
    (files: FileItem[]) => {
      const updatedFiles = files.map((file, index) => ({
        ...file,
        rank: index,
      }))

      onChange(updatedFiles)
    },
    [onChange],
  )

  const handleDelete = useCallback(
    (id: string) => {
      const updatedFiles = value.filter((file) => file.uuid !== id)

      updatePositions(updatedFiles)
    },
    [value, updatePositions],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = value.findIndex((item) => item.uuid === active.id)
        const newIndex = value.findIndex((item) => item.uuid === over?.id)
        const updatedFiles = arrayMove(value, oldIndex, newIndex)

        updatePositions(updatedFiles)
      }
    },
    [value, updatePositions],
  )

  return (
    <div className="flex flex-col gap-y-4">
      <DndContext
        id="sortable-files"
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <SortableContext items={value.map((file) => file.uuid)}>
          {value.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {value.map((file) => (
                <SortableItem
                  key={file.uuid}
                  id={file.uuid}
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
          name={name}
          type="file"
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
      className="group relative flex touch-none flex-col items-center rounded border"
    >
      {file.type === 'image' && (
        <Image
          src={file.url}
          alt={file.name}
          width={200}
          height={200}
          className="w-full object-cover"
        />
      )}
      {file.type === 'video' && (
        <video controls className="h-52 w-full object-cover">
          <source src={file.url} type={file.file?.type} />
        </video>
      )}
      <div className="absolute right-2 top-2 flex">
        <Button
          type="button"
          variant="ghost"
          className="w-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
          onClick={() => onDelete(id)}
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
