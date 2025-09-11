interface Option {
  name: string;
}

export interface LabeledOption {
  name: string;
  children: Option[];
}
