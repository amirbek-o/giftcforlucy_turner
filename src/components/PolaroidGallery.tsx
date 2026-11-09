import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Maximize2,
  X,
  Sparkles,
  FolderDown,
  RotateCcw,
  Loader2,
  Check,
} from 'lucide-react';
import { INITIAL_MEMORIES, MemoryFrame } from '../data/content';
import {
  DriveFileItem,
  fetchDriveFileAsDataUrl,
  googleSignIn,
  listDriveImages,
} from '../services/googleDrive';

const EASE_EDITORIAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface PolaroidGalleryProps {
  memories: MemoryFrame[];
  setMemories: React.Dispatch<React.SetStateAction<MemoryFrame[]>>;
  isDriveConnected: boolean;
  onDriveAuthSuccess: (email?: string | null) => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  memories,
  setMemories,
  isDriveConnected,
  onDriveAuthSuccess,
}) => {
  const [selectedLightbox, setSelectedLightbox] = useState<MemoryFrame | null>(
    null
  );
  const [activeSwapId, setActiveSwapId] = useState<string | null>(null);
  const [loadingInsightId, setLoadingInsightId] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Google Drive Image Picker Modal State
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveTargetFrameId, setDriveTargetFrameId] = useState<string | null>(
    null
  );
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null
  );
  const [driveError, setDriveError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerLocalSwap = (frameId: string) => {
    setActiveSwapId(frameId);
    fileInputRef.current?.click();
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSwapId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMemories((prev) =>
        prev.map((m) =>
          m.id === activeSwapId ? { ...m, imageUrl: dataUrl } : m
        )
      );
      setImgErrors((prev) => ({ ...prev, [activeSwapId]: false }));
      setActiveSwapId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenDrivePicker = async (frameId: string) => {
    setDriveTargetFrameId(frameId);
    setDriveModalOpen(true);
    setDriveError(null);
    setIsLoadingDrive(true);

    try {
      const files = await listDriveImages();
      setDriveFiles(files);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') {
        setDriveFiles([]);
      } else {
        setDriveError(err?.message || 'Unable to load Google Drive photos.');
      }
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleSignInAndLoadDrive = async () => {
    setDriveError(null);
    setIsLoadingDrive(true);
    try {
      const authRes = await googleSignIn();
      if (authRes) {
        onDriveAuthSuccess(authRes.user.email);
        const files = await listDriveImages();
        setDriveFiles(files);
      }
    } catch (err: any) {
      setDriveError(
        err?.message || 'Google Sign-In was cancelled or could not complete.'
      );
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleSelectDriveImage = async (file: DriveFileItem) => {
    if (!driveTargetFrameId) return;
    setDownloadingFileId(file.id);
    setDriveError(null);
    try {
      const dataUrl = await fetchDriveFileAsDataUrl(file.id);
      setMemories((prev) =>
        prev.map((m) =>
          m.id === driveTargetFrameId ? { ...m, imageUrl: dataUrl } : m
        )
      );
      setImgErrors((prev) => ({ ...prev, [driveTargetFrameId]: false }));
      setDriveModalOpen(false);
    } catch (err: any) {
      setDriveError(err?.message || 'Failed to import photo from Google Drive.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleGenerateAiInsight = async (frame: MemoryFrame) => {
    setLoadingInsightId(frame.id);
    try {
      const response = await fetch('/api/gemini/memory-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: frame.caption,
          context: frame.sessionContext,
        }),
      });
      const data = await response.json();
      if (response.ok && data.insight) {
        setMemories((prev) =>
          prev.map((m) =>
            m.id === frame.id ? { ...m, aiInsight: data.insight } : m
          )
        );
      }
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setLoadingInsightId(null);
    }
  };

  const handleResetGallery = () => {
    setMemories(INITIAL_MEMORIES);
    setImgErrors({});
  };

  return (
    <section
      id="memories"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto z-10"
    >
      {/* Hidden File Input for Local Upload/Swap */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLocalFileChange}
        className="hidden"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-3">
            02 · Summer Study Memories · July 2026
          </div>
          <h2
            className="font-editorial text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            Snapshots From Our Virtual Classroom
          </h2>
          <p className="text-sm sm:text-base text-[#E8DCC4]/80 leading-relaxed">
            Real moments from our July 2026 Babson Summer Study Zoom sessions.
            Hover to tilt each Polaroid, click to inspect full-screen, or swap
            in additional screenshots from your device or Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetGallery}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#E8DCC4]/80 hover:text-[#F5EFE6] border border-[#E8DCC4]/25 hover:bg-[#2D5A40]/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Original Screenshots</span>
          </button>
        </div>
      </div>

      {/* 3-Column Polaroid Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
        {memories.map((frame, index) => (
          <motion.article
            key={frame.id}
            initial={{ opacity: 0, y: 32, rotate: frame.tiltDeg }}
            whileInView={{ opacity: 1, y: 0, rotate: frame.tiltDeg }}
            whileHover={{
              rotate: 0,
              y: -8,
              scale: 1.015,
              transition: { duration: 0.35, ease: EASE_EDITORIAL },
            }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.75,
              delay: index * 0.12,
              ease: EASE_EDITORIAL,
            }}
            className="group bg-[#E8DCC4] text-[#1F3D2B] rounded-2xl p-4 sm:p-5 pb-6 shadow-[0_20px_50px_rgba(0,0,0,0.42)] border border-[#F5EFE6]/60 flex flex-col justify-between"
          >
            <div>
              {/* Top Polaroid Frame Metadata */}
              <div className="flex items-center justify-between text-[11px] font-medium text-[#1F3D2B]/65 mb-2.5 px-0.5">
                <span>{frame.frameNumber}</span>
                <span>{frame.dateLabel}</span>
              </div>

              {/* Screenshot Container */}
              <div
                onClick={() => setSelectedLightbox(frame)}
                className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#162C1F] border border-[#1F3D2B]/15 cursor-pointer group/img"
              >
                {!imgErrors[frame.id] ? (
                  <img
                    src={frame.imageUrl}
                    alt={frame.caption}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [frame.id]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#E8DCC4]">
                    <Camera className="w-8 h-8 text-[#D4AF37] mb-2" />
                    <span className="font-editorial text-sm">
                      {frame.caption}
                    </span>
                  </div>
                )}

                {/* Hover Lightbox Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                  <span className="text-xs font-medium text-[#F5EFE6]">
                    Click to view full screenshot
                  </span>
                  <span className="p-1.5 rounded-lg bg-[#F5EFE6]/90 text-[#1F3D2B]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Polaroid Handwritten/Editorial Caption */}
              <div className="mt-4 px-1">
                <h3 className="font-editorial text-lg sm:text-xl font-semibold text-[#1F3D2B] leading-snug">
                  {frame.caption}
                </h3>
                <p className="text-xs text-[#1F3D2B]/75 mt-1.5 leading-relaxed">
                  {frame.subCaption}
                </p>
              </div>

              {/* Subtle AI Memory Reflection Box */}
              <div className="mt-4 p-3 rounded-xl bg-[#F5EFE6] border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D5A40] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>FME Classroom Reflection</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGenerateAiInsight(frame)}
                    disabled={loadingInsightId === frame.id}
                    className="text-[11px] font-medium text-[#1F3D2B]/65 hover:text-[#1F3D2B] underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {loadingInsightId === frame.id
                      ? 'Reflecting...'
                      : 'New Takeaway'}
                  </button>
                </div>
                <p className="text-xs text-[#1F3D2B]/85 italic leading-relaxed">
                  “{frame.aiInsight}”
                </p>
              </div>
            </div>

            {/* Interactive Swap / Google Drive Import Toolbar */}
            <div className="mt-4 pt-3 border-t border-[#1F3D2B]/12 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleTriggerLocalSwap(frame.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1F3D2B]/8 hover:bg-[#1F3D2B]/15 text-[#1F3D2B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Swap Screenshot</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDrivePicker(frame.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#2D5A40] hover:bg-[#1F3D2B] text-[#F5EFE6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <FolderDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>From Drive</span>
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLightbox(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#F5EFE6] text-[#1F3D2B] rounded-2xl overflow-hidden shadow-2xl border border-[#E8DCC4]"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#E8DCC4] border-b border-[#1F3D2B]/15">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#2D5A40] font-semibold">
                    {selectedLightbox.frameNumber} · {selectedLightbox.dateLabel}
                  </span>
                  <h3 className="font-editorial text-xl font-semibold text-[#1F3D2B]">
                    {selectedLightbox.caption}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLightbox(null)}
                  aria-label="Close lightbox"
                  className="p-2 rounded-full bg-[#1F3D2B] text-[#F5EFE6] hover:bg-[#2D5A40] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#112218] max-h-[70vh] flex items-center justify-center overflow-hidden">
                <img
                  src={selectedLightbox.imageUrl}
                  alt={selectedLightbox.caption}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-[#1F3D2B]/85 italic max-w-3xl">
                  “{selectedLightbox.aiInsight}”
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedLightbox.id;
                    setSelectedLightbox(null);
                    handleTriggerLocalSwap(id);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3D2B] text-[#F5EFE6] hover:bg-[#2D5A40] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Replace Photo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Drive Photo Import Modal */}
      <AnimatePresence>
        {driveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDriveModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#F5EFE6] text-[#1F3D2B] rounded-2xl border border-[#E8DCC4] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#E8DCC4] border-b border-[#1F3D2B]/15">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#2D5A40] font-semibold">
                    Google Drive Integration
                  </span>
                  <h3 className="font-editorial text-xl font-semibold text-[#1F3D2B]">
                    Import a Summer Study Photo from Google Drive
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDriveModalOpen(false)}
                  className="p-1.5 rounded-full bg-[#1F3D2B]/10 hover:bg-[#1F3D2B]/20 text-[#1F3D2B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {driveError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-xs text-red-900">
                    {driveError}
                  </div>
                )}

                {isLoadingDrive ? (
                  <div className="py-12 flex flex-col items-center justify-center text-[#1F3D2B]/70">
                    <Loader2 className="w-7 h-7 animate-spin text-[#2D5A40] mb-3" />
                    <p className="text-sm font-medium">
                      Connecting to Google Drive...
                    </p>
                  </div>
                ) : !isDriveConnected && driveFiles.length === 0 ? (
                  <div className="py-8 text-center space-y-4">
                    <p className="text-sm text-[#1F3D2B]/80 max-w-md mx-auto leading-relaxed">
                      Sign in with Google to browse your recent Google Drive
                      photos and place them directly into this Polaroid frame.
                    </p>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleSignInAndLoadDrive}
                        className="gsi-material-button"
                      >
                        <div className="gsi-material-button-state"></div>
                        <div className="gsi-material-button-content-wrapper">
                          <div className="gsi-material-button-icon">
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              style={{ display: 'block' }}
                            >
                              <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                              ></path>
                              <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                              ></path>
                              <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                              ></path>
                              <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                              ></path>
                              <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                          </div>
                          <span className="gsi-material-button-contents">
                            Sign in with Google
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-sm text-[#1F3D2B]/75">
                      No image files were found in your Google Drive.
                    </p>
                    <button
                      type="button"
                      onClick={handleSignInAndLoadDrive}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3D2B] text-[#F5EFE6] cursor-pointer"
                    >
                      Refresh Drive List
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-[#1F3D2B]/70">
                      Select any image below to place it into the selected
                      Polaroid frame:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                      {driveFiles.map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          disabled={downloadingFileId === file.id}
                          onClick={() => handleSelectDriveImage(file)}
                          className="group text-left rounded-xl border border-[#1F3D2B]/15 bg-[#E8DCC4]/60 hover:bg-[#E8DCC4] p-2 transition-all flex flex-col justify-between cursor-pointer"
                        >
                          <div className="aspect-video w-full rounded-lg bg-[#1F3D2B]/10 overflow-hidden mb-2 flex items-center justify-center relative">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Camera className="w-5 h-5 text-[#1F3D2B]/50" />
                            )}
                            {downloadingFileId === file.id && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-[#F5EFE6]" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium text-[#1F3D2B] truncate">
                              {file.name}
                            </span>
                            <Check className="w-3.5 h-3.5 text-[#2D5A40] opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
