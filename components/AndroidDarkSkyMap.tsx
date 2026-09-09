import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface AndroidDarkSkyMapProps {
  latitude: number;
  longitude: number;
  layerOpacity: number;
  mapType: 'standard' | 'satellite';
  tileUrl: string;
}

export interface AndroidMapRef {
  centerOnUser: (lat: number, lon: number) => void;
}

export const AndroidDarkSkyMap = React.forwardRef<AndroidMapRef, AndroidDarkSkyMapProps>(
  ({ latitude, longitude, layerOpacity, mapType, tileUrl }, ref) => {
    const webViewRef = useRef<WebView | null>(null);

    React.useImperativeHandle(ref, () => ({
      centerOnUser: (lat: number, lon: number) => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            if (window.centerOn) {
              window.centerOn(${lat}, ${lon});
            }
            true;
          `);
        }
      },
    }));

    // Aggiorna opacità dinamicamente
    useEffect(() => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.setLayerOpacity) {
            window.setLayerOpacity(${layerOpacity});
          }
          true;
        `);
      }
    }, [layerOpacity]);

    // Aggiorna tipo mappa (standard/satellite) dinamicamente
    useEffect(() => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.setBaseMap) {
            window.setBaseMap('${mapType}');
          }
          true;
        `);
      }
    }, [mapType]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            html, body, #map {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #0B0D17;
            }
            /* Filtro CSS per trasformare OpenStreetMap in una mappa notturna astronomica SENZA watermark e SENZA API key */
            .dark-tiles {
              filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%);
              -webkit-filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%);
            }
            .leaflet-control-attribution {
              background: rgba(11, 13, 23, 0.75) !important;
              color: #9CA3AF !important;
              font-size: 8px !important;
            }
            .leaflet-control-attribution a {
              color: #60A5FA !important;
            }
            .pulsing-marker {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #E63946;
              border: 3px solid #FFFFFF;
              box-shadow: 0 0 14px #E63946;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map', {
              zoomControl: false,
              attributionControl: true
            }).setView([${latitude}, ${longitude}], 8);

            // Layer Mappa Notturna 100% Open e Libera (OpenStreetMap ufficiale, zero API key)
            var darkLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              className: 'dark-tiles',
              attribution: '&copy; OpenStreetMap'
            });

            // Layer Mappa Satellite Esri HD (100% Free, zero watermark, zero API key)
            var satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              attribution: '&copy; Esri World Imagery'
            });

            var currentBaseLayer = ${mapType === 'satellite'} ? satLayer : darkLayer;
            currentBaseLayer.addTo(map);

            // Layer Inquinamento Luminoso VIIRS HD (trasparente, fino a zoom 16)
            var viirsLayer = L.tileLayer('${tileUrl}', {
              maxZoom: 16,
              opacity: ${layerOpacity},
              attribution: '&copy; VIIRS / lightpollutionmap.info'
            });

            if (${layerOpacity} > 0) {
              viirsLayer.addTo(map);
            }

            // Marker Posizione Utente
            var customIcon = L.divIcon({
              className: 'pulsing-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            var userMarker = L.marker([${latitude}, ${longitude}], { icon: customIcon }).addTo(map);

            // Funzioni richiamabili da React Native
            window.setLayerOpacity = function(val) {
              if (val <= 0) {
                if (map.hasLayer(viirsLayer)) {
                  map.removeLayer(viirsLayer);
                }
              } else {
                viirsLayer.setOpacity(val);
                if (!map.hasLayer(viirsLayer)) {
                  viirsLayer.addTo(map);
                }
              }
            };

            window.setBaseMap = function(type) {
              if (type === 'satellite') {
                if (map.hasLayer(darkLayer)) map.removeLayer(darkLayer);
                satLayer.addTo(map);
                if (map.hasLayer(viirsLayer)) {
                  viirsLayer.bringToFront();
                }
              } else {
                if (map.hasLayer(satLayer)) map.removeLayer(satLayer);
                darkLayer.addTo(map);
                if (map.hasLayer(viirsLayer)) {
                  viirsLayer.bringToFront();
                }
              }
            };

            window.centerOn = function(lat, lon) {
              map.flyTo([lat, lon], 9, {
                animate: true,
                duration: 1.2
              });
              userMarker.setLatLng([lat, lon]);
            };
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          overScrollMode="never"
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D17',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0B0D17',
  },
});
