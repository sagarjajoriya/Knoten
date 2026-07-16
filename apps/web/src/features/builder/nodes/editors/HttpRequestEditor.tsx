import { type ReactNode } from 'react';

import { PropertyField, SelectInput, TextInput } from '../../components/properties/PropertyField';
import { type HttpMethod, type HttpRequestData } from '../components/HttpRequestNode';
import { type NodePropertiesEditorProps } from '../types';

const HTTP_METHODS: readonly HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/** Properties editor for the HTTP Request node — method and target URL. */
export function HttpRequestEditor({
  data,
  updateData,
}: NodePropertiesEditorProps<HttpRequestData>): ReactNode {
  return (
    <div className="space-y-4">
      <PropertyField label="Method" htmlFor="http-method">
        <SelectInput
          id="http-method"
          value={data.method}
          onChange={(event) => {
            updateData({ method: event.target.value as HttpMethod });
          }}
        >
          {HTTP_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </SelectInput>
      </PropertyField>

      <PropertyField label="URL" htmlFor="http-url">
        <TextInput
          id="http-url"
          type="url"
          placeholder="https://api.example.com/resource"
          value={data.url}
          onChange={(event) => {
            updateData({ url: event.target.value });
          }}
        />
      </PropertyField>
    </div>
  );
}
