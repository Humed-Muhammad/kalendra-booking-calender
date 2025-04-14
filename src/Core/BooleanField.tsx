type Props = {
  value: boolean
}
export const BooleanField = ({ value }: Props) => {
  switch (value) {
    case true:
      return <div>Yes</div>
    case false:
      return <div>No</div>
    default:
      return <div>Unknown</div>
  }
}
