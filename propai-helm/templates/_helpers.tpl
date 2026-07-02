{{/* Common labels */}}
{{- define "propai.labels" -}}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/part-of: propai
{{- end }}
