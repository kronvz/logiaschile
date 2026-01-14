import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Clock, Calendar, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface Logia {
  numero: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  jurisdiccion: string;
  dias: string;
  hora: string;
  url_maps: string;
}

const Index = () => {
  const [logias, setLogias] = useState<Logia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState<string>('todas');
  const [selectedJurisdiccion, setSelectedJurisdiccion] = useState<string>('todas');
  const [selectedDia, setSelectedDia] = useState<string>('todos');

  // Cargar datos de logias
  useEffect(() => {
    const loadLogias = async () => {
      try {
        const response = await fetch('/data/logias.json');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        setLogias(data);
      } catch (error) {
        console.error('Error cargando logias:', error);
        toast.error('Error al cargar los datos de las logias');
      } finally {
        setLoading(false);
      }
    };

    loadLogias();
  }, []);

  // Obtener listas únicas para filtros
  const ciudades = useMemo(() => {
    return Array.from(new Set(logias.map(logia => logia.ciudad))).sort();
  }, [logias]);

  const jurisdicciones = useMemo(() => {
    return Array.from(new Set(logias.map(logia => logia.jurisdiccion))).sort();
  }, [logias]);

  const dias = useMemo(() => {
    return Array.from(new Set(logias.map(logia => logia.dias))).sort();
  }, [logias]);

  // Filtrar logias
  const logiasFiltradas = useMemo(() => {
    return logias.filter(logia => {
      const matchesSearch = searchTerm === '' || 
        logia.numero.toString().includes(searchTerm.toLowerCase()) ||
        logia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logia.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logia.ciudad.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCiudad = selectedCiudad === 'todas' || logia.ciudad === selectedCiudad;
      const matchesJurisdiccion = selectedJurisdiccion === 'todas' || logia.jurisdiccion === selectedJurisdiccion;
      const matchesDia = selectedDia === 'todos' || logia.dias === selectedDia;

      return matchesSearch && matchesCiudad && matchesJurisdiccion && matchesDia;
    });
  }, [logias, searchTerm, selectedCiudad, selectedJurisdiccion, selectedDia]);

  const limpiarFiltros = () => {
    setSearchTerm('');
    setSelectedCiudad('todas');
    setSelectedJurisdiccion('todas');
    setSelectedDia('todos');
  };

  const abrirEnMapa = (url: string, nombre: string) => {
    window.open(url, '_blank');
    toast.success(`Abriendo ubicación de ${nombre} en Google Maps`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando datos de las logias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Buscador de Logias Masónicas de Chile
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Herramienta informativa para la exploración y localización de logias masónicas en territorio chileno. 
              Los datos incluyen información de contacto, horarios de trabajo y ubicaciones geográficas.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Panel de búsqueda */}
        <Card className="mb-8 search-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
            <CardDescription>
              Utilice los filtros para encontrar logias por número, nombre, ciudad, jurisdicción o día de trabajo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="text-sm font-medium mb-2 block">Búsqueda general</label>
                <Input
                  placeholder="Número, nombre, dirección o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Ciudad</label>
                <Select value={selectedCiudad} onValueChange={setSelectedCiudad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las ciudades</SelectItem>
                    {ciudades.map(ciudad => (
                      <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdicción</label>
                <Select value={selectedJurisdiccion} onValueChange={setSelectedJurisdiccion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las jurisdicciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las jurisdicciones</SelectItem>
                    {jurisdicciones.map(jurisdiccion => (
                      <SelectItem key={jurisdiccion} value={jurisdiccion}>{jurisdiccion}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Día de trabajo</label>
                <Select value={selectedDia} onValueChange={setSelectedDia}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los días" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los días</SelectItem>
                    {dias.map(dia => (
                      <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={limpiarFiltros}
                className="flex items-center gap-2"
              >
                Limpiar filtros
              </Button>
              <p className="text-sm text-muted-foreground">
                Mostrando {logiasFiltradas.length} de {logias.length} logias
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {logiasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron logias</h3>
              <p className="text-muted-foreground mb-4">
                No hay logias que coincidan con los criterios de búsqueda seleccionados.
              </p>
              <Button onClick={limpiarFiltros} variant="outline">
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Búsqueda</CardTitle>
              <CardDescription>
                {logiasFiltradas.length} logia{logiasFiltradas.length !== 1 ? 's' : ''} encontrada{logiasFiltradas.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="results-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">N°</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Jurisdicción</TableHead>
                      <TableHead className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Día
                      </TableHead>
                      <TableHead className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Hora
                      </TableHead>
                      <TableHead className="text-center">Ubicación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logiasFiltradas.map((logia) => (
                      <TableRow key={logia.numero} className="lodge-card">
                        <TableCell className="font-medium">
                          <Badge variant="outline">{logia.numero}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{logia.nombre}</TableCell>
                        <TableCell>{logia.direccion}</TableCell>
                        <TableCell>{logia.ciudad}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {logia.jurisdiccion}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {logia.dias}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {logia.hora}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => abrirEnMapa(logia.url_maps, logia.nombre)}
                            className="btn-primary flex items-center gap-1"
                          >
                            <MapPin className="h-4 w-4" />
                            Ver en mapa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Buscador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                Este buscador presenta información pública sobre logias masónicas regulares en Chile, 
                incluyendo datos de contacto, horarios de trabajo y ubicaciones geográficas. 
                La información tiene carácter exclusivamente informativo y cultural.
              </p>
              <p className="mt-3">
                Los datos provienen de registros oficiales de logias masónicas chilenas y se actualizan 
                periódicamente. Para información específica sobre actividades o requisitos, 
                se recomienda contactar directamente con cada logia.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Buscador de Logias Masónicas de Chile - Información con fines culturales e informativos</p>
            <p className="mt-1">Los datos presentados son de carácter público y se basan en registros oficiales</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
