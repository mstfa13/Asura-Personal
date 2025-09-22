
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function DataUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Upload</h1>
              <p className="text-gray-600 mt-1">Upload CSV or Excel files to import your data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your Data Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your files here, or click to select
              </p>
              <p className="text-gray-600 mb-4">
                Support for CSV, XLSX, and XLS files up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <File className="w-5 h-5" />
                <span>Uploaded Files ({uploadedFiles.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Process Files
                </Button>
                <Button variant="outline">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Format Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Data Format Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Columns</h4>
                <p className="text-gray-600 mb-3">
                  Your CSV/Excel files should include the following columns:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Date:</strong> Format: YYYY-MM-DD (e.g., 2024-01-15)</li>
                  <li><strong>Activity:</strong> Name of the activity (e.g., "Gym Workout", "Boxing Training")</li>
                  <li><strong>Category:</strong> Type of activity (e.g., "Fitness", "Health", "Career")</li>
                  <li><strong>Duration:</strong> Time spent in minutes (e.g., 60)</li>
                  <li><strong>Notes:</strong> Optional additional information</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sample Data</h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="text-gray-700">
                    Date,Activity,Category,Duration,Notes<br/>
                    2024-01-15,Gym Workout,Fitness,75,Chest and triceps<br/>
                    2024-01-15,Take Creatine,Health,1,Post-workout<br/>
                    2024-01-16,Boxing Training,Sports,90,Sparring session
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
