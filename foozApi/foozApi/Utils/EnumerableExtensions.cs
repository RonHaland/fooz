namespace foozApi.Utils;

public static class EnumerableExtensions
{
    public static IEnumerable<T> Shift<T>(this IEnumerable<T> source, int count)
    {
        var input = source.ToList();
        if (count == 0) { return input; }
        if (count < 0)
        {
            return ShiftLeft(input, -count);
        }
        else
        {
            return ShiftRight(input, count);
        }

        //return input.AsEnumerable();
    }
    public static List<T> ShiftLeft<T>(this List<T> list, int shiftBy)
    {
        if (list.Count <= shiftBy)
        {
            return list;
        }

        return list.Skip(shiftBy).Concat(list.Take(shiftBy)).ToList();
    }

    public static List<T> ShiftRight<T>(this List<T> list, int shiftBy)
    {
        if (list.Count <= shiftBy)
        {
            return list;
        }

        return list.ShiftLeft(list.Count - shiftBy);
    }
}
