# Serviço De Geolocalização 'Geofences'

## Context and Problem Statement

A CapibaFit tem um diferencial de Valorização da Cidade que concede um bônus se a atividade for concluída em um ponto turístico (ex: Marco Zero). O sistema precisa de uma maneira confiável para verificar a geolocalização do usuário no final da atividade.

## Considered Options

* Google Maps Platform
* OpenStreetMap (OSM) / Leaflet
* Uso de Dados Brutos de GPS

## Decision Outcome

Chosen option: "Google Maps Platform", because O provedor deve ser capaz de definir e consultar zonas geográficas (latitude/longitude/raio). Implicações: Exige a criação de um banco de dados de "Geofences Capiba" que armazene as coordenadas e o raio de cada ponto turístico.
