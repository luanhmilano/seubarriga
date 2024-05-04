const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
    const find = (filter = {}) => {
        return app.db('transfers').where(filter).select()
    }

    const validate = async (transfer) => {
        if (!transfer.description) throw new ValidationError('Descrição é um atributo obrigatório');
        if (!transfer.ammount) throw new ValidationError('Valor é um atributo obrigatório');
        if (!transfer.date) throw new ValidationError('Data é um atributo obrigatório');
        if (!transfer.acc_ori_id) throw new ValidationError('Conta de Origem é um atributo obrigatório');
        if (!transfer.acc_dest_id) throw new ValidationError('Conta de Destino é um atributo obrigatório');
        if (transfer.acc_ori_id === transfer.acc_dest_id) throw new ValidationError('Não é possível transferir de uma conta para ela mesma');
    
        const accounts = await app.db('accounts').whereIn('id', [transfer.acc_dest_id, transfer.acc_ori_id]);
        accounts.forEach((acc) => {
          if (acc.user_id !== parseInt(transfer.user_id, 10)) throw new ValidationError(`Conta #${acc.id} não pertence ao usuário`);
        });
    };
    
    const save = async (transfer) => {
        const result = await app.db('transfers').insert(transfer, '*');
        const transferId = result[0].id;
    
        const transactions = [
          { description: `Transfer to acc #${transfer.acc_dest_id}`, date: transfer.date, ammount: transfer.ammount * -1, type: 'O', acc_id: transfer.acc_ori_id, transfer_id: transferId, status: true },
          { description: `Transfer from acc #${transfer.acc_ori_id}`, date: transfer.date, ammount: transfer.ammount, type: 'I', acc_id: transfer.acc_dest_id, transfer_id: transferId, status: true },
        ];
    
        await app.db('transactions').insert(transactions);
        return result;
    };

    return { find, validate, save }
}