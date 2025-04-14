import { useFormikContext } from 'formik'
import { useEffect } from 'react'

interface Props<T> {
  data: T
}
export const FormikObserver = <T,>({ data }: Props<T>) => {
  const { setValues, initialValues } = useFormikContext<T>()
  useEffect(() => {
    if (data) {
      setValues({ ...initialValues, ...data })
    }
  }, [JSON.stringify(data)])
  return <div />
}
