import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { fileToOptimizedBase64 } from '../utils/imageUpload';

interface ImageFileInputProps {
  label: string;
  value: string;
  onChange: (base64OrUrl: string) => void;
  aspectRatio?: 'square' | 'wide';
  placeholderText?: string;
  allowSamplePhotos?: boolean;
  samplePhotos?: string[];
  helperText?: string;
}

export const ImageFileInput: React.FC<ImageFileInputProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'wide',
  placeholderText = 'Selecione uma foto do seu dispositivo',
  allowSamplePhotos = false,
  samplePhotos = [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  ],
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP, GIF).');
      return;
    }

    try {
      setLoading(true);
      const base64 = await fileToOptimizedBase64(file);
      onChange(base64);
    } catch (err: any) {
      setError(err?.message || 'Falha ao processar arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUrlInput('');
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {allowSamplePhotos && (
            <button
              type="button"
              onClick={() => {
                const random = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
                onChange(random);
              }}
              className="text-[11px] text-[#176B78] hover:text-[#125560] flex items-center gap-1 font-semibold transition"
            >
              <Sparkles className="w-3 h-3 text-[#176B78]" />
              Foto exemplo
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#5E7180] hover:text-[#176B78] transition underline"
          >
            {showUrlInput ? 'Usar arquivo do dispositivo' : 'Inserir URL web'}
          </button>
        </div>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            className="flex-1 bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="bg-[#176B78] hover:bg-[#125560] text-white text-xs px-4 py-2.5 rounded-xl transition font-medium"
          >
            Aplicar
          </button>
        </div>
      ) : null}

      {/* Main Upload Dropzone / Button area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition cursor-pointer p-4 text-center ${
          isDragging
            ? 'border-[#176B78] bg-[#176B78]/10 scale-[1.01]'
            : 'border-[#BFE8DD] hover:border-[#176B78] bg-[#F0FAF7]/80 hover:bg-[#F0FAF7]'
        } ${value ? 'border-solid border-[#BFE8DD]' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileInputChange}
        />

        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-7 h-7 border-2 border-[#176B78] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-600 font-medium">Carregando e otimizando imagem...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div
              className={`relative overflow-hidden rounded-xl border border-[#BFE8DD] shadow-sm bg-white shrink-0 ${
                aspectRatio === 'square' ? 'w-24 h-24' : 'w-36 h-28'
              }`}
            >
              <img
                src={value}
                alt="Preview da imagem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/300x200/BFE8DD/176B78?text=Erro+Imagem';
                }}
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                Imagem do dispositivo carregada
              </div>
              <p className="text-[11px] text-[#5E7180] mt-1">
                Foto pronta para salvar. Clique em qualquer lugar deste painel para trocar de arquivo.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-white hover:bg-slate-50 text-[#176B78] border border-[#BFE8DD] text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#176B78]" />
                  Trocar arquivo
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Remover
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#BFE8DD] text-[#176B78] flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6 text-[#176B78]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Clique aqui para escolher um arquivo do dispositivo
              </p>
              <p className="text-[11px] text-[#5E7180] mt-0.5">
                ou arraste e solte uma imagem aqui (JPG, PNG, WEBP)
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] bg-white border border-[#BFE8DD] text-[#176B78] font-medium px-3 py-1 rounded-full shadow-xs mt-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#176B78]" />
              {placeholderText}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
