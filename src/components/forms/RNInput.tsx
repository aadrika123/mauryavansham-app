// form
import { useFormContext, Controller } from 'react-hook-form';
import { TextInput, TextInputProps, View } from 'react-native';
import { HelperText } from 'react-native-paper';

// ----------------------------------------------------------------------

type Props = TextInputProps & {
  name: string;
  label?: string;
};

export default function RHFTextField({ name, label, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <View>
          <TextInput
            ref={ref}
            // label={label}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            // mode="outlined"
            value={
              typeof field.value === 'number' && field.value === 0
                ? ''
                : field.value
            }
            // error={Boolean(error)}
            {...other}
          />
          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      )}
    />
  );
}
