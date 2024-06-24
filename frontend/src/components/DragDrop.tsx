import React, { ChangeEvent, useCallback, useRef, useState, useEffect } from "react";

interface IFileTypes {
  id: number;
  object: File;
}

const DragDrop = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const fileId = useRef<number>(0);
  const filesContainerRef = useRef<HTMLDivElement | null>(null);

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      let selectFiles: File[] = [];
      let tempFiles: IFileTypes[] = files;

      if (e.type === "drop") {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }

      // 최대 5개 파일까지만 허용
      if (files.length + selectFiles.length > 3) {
        
        alert("최대 3개의 파일만 업로드할 수 있습니다.");
        return;
      }
      
      // 20mb 까지 허용
      for (const file of selectFiles) {
        if (file.size > 20 * 1024 * 1024) {
          alert(`파일 크기가 20MB를 초과했습니다: ${file.name}`);
          continue;
        }
        tempFiles = [
          ...tempFiles,
          {
            id: fileId.current++,
            object: file
          }
        ];
      }

      setFiles(tempFiles);
    },
    [files]
  );

  const handleFilterFile = useCallback(
    (id: number): void => {
      setFiles(files.filter((file: IFileTypes) => file.id !== id));
    },
    [files]
  );

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  useEffect(() => {
    if (filesContainerRef.current) {
      filesContainerRef.current.style.maxHeight = `${files.length * 50}px`;
    }
  }, [files]);

  return (
    <div className="DragDrop">
      <input type="file" id="fileUpload" style={{ display: "none" }} multiple={true} onChange={onChangeFiles} />
      <label
        className={isDragging ? "DragDrop-File-Dragging" : "DragDrop-File"}
        htmlFor="fileUpload"
        ref={dragRef}
      >
        <div>파일 3개까지 첨부하시오</div>
      </label>

      <div className="DragDrop-Files" ref={filesContainerRef} >
        {files.length > 0 &&
          files.map((file: IFileTypes) => {
            const {
              id,
              object: { name }
            } = file;

            return (
              <div key={id} className="DragDrop-Files-Item">
                <div>{name}</div>
                <div className="DragDrop-Files-Filter" onClick={() => handleFilterFile(id)}>X</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DragDrop;
